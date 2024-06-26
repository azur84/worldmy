const { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { timeMessage } = require("../../bin/fastconst");
const { getTranslation } = require("../../bin/translation");

module.exports = {
    id: "cancel_exploration",
    data: (interaction, userid) => new ButtonBuilder()
        .setCustomId(`cancel_exploration@userid=${userid}`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji("✖️")
        .setLabel(getTranslation("cancel", interaction.locale)),
    async execute(interaction = ButtonInteraction.prototype) {
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(getTranslation("owner_error", interaction.locale), interaction.locale)] })
            return
        }
        const menu = await interaction.client.selectmenus.get("selectplace").data(interaction, parm.userid)
        const row = new ActionRowBuilder()
            .addComponents(menu)
        const embed = new EmbedBuilder()
            .setColor(0x00B300)
            .setTitle(getTranslation("exploration", interaction.locale))
            .setDescription(getTranslation("exploration_menu_reply", interaction.locale))
        const load = await timeMessage(interaction, "loading")
        await interaction.message.edit({ components: [row], embeds: [embed] })
        await load()
    }
}