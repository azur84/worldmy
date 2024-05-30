const { ButtonStyle, ButtonBuilder, ButtonInteraction, EmbedBuilder, ActionRowBuilder } = require("discord.js")
const { getTranslation } = require("../../bin/translation")
const { paramCustomId } = require("../../bin/utility")

module.exports = {
    id: "edit_market_buy",
    data: (interaction, userid, id) => new ButtonBuilder()
        .setCustomId(`edit_market_buy@userid=${userid}&id=${id}`)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🛠️")
        .setLabel(`${getTranslation("edit", interaction.locale)}`),
    async execute(interaction = ButtonInteraction.prototype) {
        const parm = paramCustomId(interaction.customId)
        const embed = new EmbedBuilder()
            .setColor(0x6699CC)
            .setTitle(getTranslation("market", interaction.locale))
        // .setDescription(getTranslation("", interaction.locale))
        const button = await interaction.client.buttons.get("edit_market_delete").data(interaction, parm.userid, parm.id)
        const row = new ActionRowBuilder()
            .addComponents(button)
        await interaction.reply({ embeds: [embed], components: [row],ephemeral:true })
    }
}