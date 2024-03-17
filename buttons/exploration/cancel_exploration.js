const { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { timeMessage } = require("../../bin/fastconst");
const localbutton = require("../../local.json").buttons.cancel_exploration
const localmodal = require("../../local.json").commands.config.exploration
module.exports = {
    id: "cancel_exploration",
    data: (interaction) => new ButtonBuilder()
        .setCustomId("cancel_exploration")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("✖️")
        .setLabel(localbutton.label[interaction.locale] || localbutton.label.en),
    async execute(interaction = ButtonInteraction.prototype) {
        const menu = interaction.client.selectmenus.get("selectplace").data(interaction)
        const row = new ActionRowBuilder()
            .addComponents(menu)
        const embed = new EmbedBuilder()
            .setColor(0x00B300)
            .setTitle(localmodal.name[interaction.locale] || "exploration")
            .setDescription(localmodal.panel.reply[interaction.locale] || "setup exploration places")
        const load = await timeMessage(interaction,"loading")
        await interaction.message.edit({ components: [row], embeds: [embed] })
        await load()
    }
}