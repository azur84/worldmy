const { ButtonStyle, ButtonBuilder, ButtonInteraction, EmbedBuilder, ActionRowBuilder } = require("discord.js")
const { getTranslation } = require("../../bin/translation")
const { paramCustomId } = require("../../bin/utility")
const { deleteData, getData } = require("../../bin/data")
const { Inventory } = require("../../bin/inventory")

module.exports = {
    id: "edit_market_delete",
    data: (interaction, userid, id, valid = false) => new ButtonBuilder()
        .setCustomId(`edit_market_delete@userid=${userid}&id=${id}&valid=${valid}`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🗑️")
        .setLabel(`${getTranslation("delete", interaction.locale)}`),
    async execute(interaction = ButtonInteraction.prototype) {
        const parm = paramCustomId(interaction.customId)
        if (parm.valid == "true") {
            const forumid = await getData(interaction.guildId, "channels", "market")
            const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
            const marketdata = await getData(interaction.guildId, "market", `${parm.id}`)
            inv[marketdata.item] = inv[marketdata.item] + marketdata.current_quantity
            await inv.save()
            const forum = await interaction.guild.channels.fetch(forumid)
            const thread = await forum.threads.fetch(parm.id)
            await thread.delete()
            await deleteData(interaction.guildId, "market", `${parm.id}`)
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xED0004)
                .setTitle(getTranslation("market", interaction.locale))
                .setDescription(getTranslation("are_sure_delete", interaction.locale))
            const button = await interaction.client.buttons.get("edit_market_delete").data(interaction, parm.userid, parm.id, true)
            const row = new ActionRowBuilder()
                .addComponents(button)
            await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] })
        }
    }
}