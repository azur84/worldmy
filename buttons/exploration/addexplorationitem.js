const { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const {  select, embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const { timer, paramCustomId } = require("../../bin/utility");
const { getTranslation } = require("../../bin/translation");

module.exports = {
    id: "addexplorationitem",
    data: (interaction, placeId, userid) => new ButtonBuilder()
        .setCustomId(`addexplorationitem@placeId=${placeId}&userid=${userid}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➕")
        .setLabel(getTranslation("add_item", interaction.locale)),
    async execute(interaction = ButtonInteraction.prototype) {
        await interaction.deferUpdate()
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(getTranslation("owner_error", interaction.locale), interaction.locale)] })
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
            .setTitle(getTranslation("add_item", interaction.locale))
            .setDescription(getTranslation("select_item", interaction.locale))
            .addFields([{ name: "timeout", value: timer(60) }, { name: "command", value: "</select file:1216458571299033208>" }])
        await interaction.message.edit({ components: [], embeds: [embed] })
    }
}