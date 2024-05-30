const { ButtonStyle, ButtonBuilder, ButtonInteraction } = require("discord.js")
const { getTranslation } = require("../../bin/translation")
const { paramCustomId } = require("../../bin/utility")
const { Inventory } = require("../../bin/inventory")
const { getData, deleteData } = require("../../bin/data")

module.exports = {
    id: "market_buy",
    data: (interaction, cost, id) => new ButtonBuilder()
        .setCustomId(`market_buy@cost=${cost}&id=${id}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🪙")
        .setLabel(cost == "all" ? getTranslation("buy_all") : `${getTranslation("buy", interaction.locale)} X${cost}`),
    async execute(interaction = ButtonInteraction.prototype) {
        await interaction.deferUpdate()
        const parm = paramCustomId(interaction.customId)
        const marketdata = await getData(interaction.guildId, "market", `${parm.id}`)
        const forumid = await getData(interaction.guildId, "channels", "market")
        if (parm.cost == "all") {
            const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
            if (!inv[marketdata.item]) inv[marketdata.item] = 0
            inv[marketdata.item] = inv[marketdata.item] + marketdata.current_quantity
            await inv.save()
            const forum = await interaction.guild.channels.fetch(forumid)
            const thread = await forum.threads.fetch(parm.id)
            await thread.delete()
            await deleteData(interaction.guildId, "market", `${parm.id}`)
        }
    }
}