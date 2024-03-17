const { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { timeMessage, select, embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const { timer, paramCustomId } = require("../../bin/utility");
const local = require("../../local.json").buttons.addexplorationitem

module.exports = {
    id: "addexplorationitem",
    data: (interaction) => new ButtonBuilder()
        .setCustomId("addexplorationitem")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➕")
        .setLabel(local.label[interaction.locale] || local.label.en),
    async execute(interaction = ButtonInteraction.prototype) {
        const parm = paramCustomId(interaction.customId)
        interaction.client.select.set(interaction.user.id, (item, number) => {
            interaction.channel.send(`${item},${number}`)
            interaction.client.select.delete(interaction.user.id)
            
        })
        setTimeout(() => {
            if (!interaction.client.select.get(interaction.user.id)) return
            interaction.client.select.delete(interaction.user.id)
            const cancel = interaction.client.buttons.get("cancel_exploration").data(interaction)
            const actionrow = new ActionRowBuilder()
                .addComponents(cancel)
            interaction.message.edit({ components: [actionrow], embeds: [embedError("timeout")] })
        }, 30000)
        const embed = new EmbedBuilder()
            .setColor(0x2ACAEA)
            .setTitle(local.reply.title[interaction.locale] || local.reply.title.en)
            .setDescription(local.reply.description[interaction.locale] || local.reply.description.en)
            .addFields([{ name: "timeout", value: timer() }, { name: "command", value: "</select item:1216458571299033208>" }])
        const load = await timeMessage(interaction, "loading")
        await interaction.message.edit({ components: [], embeds: [embed] })
        await load()
    }
}