const { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { timeMessage, select, embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const { timer, paramCustomId } = require("../../bin/utility");
const local = require("../../local.json").buttons.addexplorationitem
const otherlocal = require("../../local.json").other

module.exports = {
    id: "addexplorationitem",
    data: (interaction, placeId, userid) => new ButtonBuilder()
        .setCustomId(`addexplorationitem@placeId=${placeId}&userid=${userid}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➕")
        .setLabel(local.label[interaction.locale] || local.label.en),
    async execute(interaction = ButtonInteraction.prototype) {
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(otherlocal.ownermessage[interaction.locale] || "You are not my owner.", interaction.locale)] })
            return
        }
        interaction.client.select.set(interaction.user.id, async (type, filename, file) => {
            if (type != "file") return
            const place = await Place.getPlaceById(interaction.guildId, parm.placeId)
            place.itemstable = file
            place.save()
            interaction.client.select.delete(interaction.user.id)
        })
        setTimeout(() => {
            if (!interaction.client.select.get(interaction.user.id)) return
            interaction.client.select.delete(interaction.user.id)
            const cancel = interaction.client.buttons.get("cancel_exploration").data(interaction, parm.userid)
            const actionrow = new ActionRowBuilder()
                .addComponents(cancel)
            interaction.message.edit({ components: [actionrow], embeds: [embedError("timeout")] })
        }, 60000)
        const embed = new EmbedBuilder()
            .setColor(0x2ACAEA)
            .setTitle(local.reply.title[interaction.locale] || local.reply.title.en)
            .setDescription(local.reply.description[interaction.locale] || local.reply.description.en)
            .addFields([{ name: "timeout", value: timer(60) }, { name: "command", value: "</select file:1216458571299033208>" }])
        const load = await timeMessage(interaction, "loading")
        await interaction.message.edit({ components: [], embeds: [embed] })
        await load()
    }
}