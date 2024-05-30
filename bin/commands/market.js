const { EmbedBuilder, CommandInteraction, ActionRowBuilder } = require("discord.js")
const { Item } = require("../item")
const { getTranslation } = require("../translation")
const { getData, writeData } = require("../data")
const { findCommonDivisors } = require("../utility")
const { embedError } = require("../fastconst")
const { Inventory } = require("../inventory")

async function market_offer_create(interaction = CommandInteraction.prototype) {
    const forumid = await getData(interaction.guildId, "channels", "market")
    const forum = await interaction.guild.channels.fetch(forumid)
    const itemid = interaction.options.getString("item")
    const quantity = interaction.options.getInteger("quantity") || 1
    const formoney = interaction.options.getInteger("for")
    const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
    const itemcount = inv[itemid] || 0
    if (itemcount < quantity) {
        const embed = embedError(`${getTranslation("missing_item_quantity", interaction.locale)}`, interaction.locale)
        await interaction.reply({ embeds: [embed], ephemeral: true })
        return
    }
    inv[itemid] = inv[itemid] - quantity
    await inv.save()
    const item = await Item.findOne({
        where: {
            guildid: interaction.guildId,
            id: id,
        }
    })
    const embed = new EmbedBuilder()
        .setTitle(getTranslation("market", interaction.locale))
        .setColor(0x6699CC)
        .addFields([
            {
                name: `${getTranslation("item", interaction.locale)}:`,
                value: `${item}`,
                inline: true
            },
            {
                name: `${getTranslation('quantity', interaction.locale)}:`,
                value: `${quantity}`,
                inline: true
            },
            {
                name: `${getTranslation('cost', interaction.locale)}:`,
                value: `${formoney}`,
                inline: true
            }
        ])
        .setFooter({
            text: `${interaction.member.displayName}`,
            iconURL: interaction.member.displayAvatarURL()
        })

    await interaction.reply({ embeds: [embed], ephemeral: true })
    const thread = await forum.threads.create({ name: `${item} X${quantity}`, message: { content: `${item} X${quantity}` } })
    const threadid = thread.id

    await writeData(interaction.guildId, "market", `${threadid}`, { quantity: quantity, current_quantity: quantity, price: formoney, item: item.id })
    const divisors = findCommonDivisors(quantity, formoney)

    const buyButtonBuilder = await interaction.client.buttons.get("market_buy").data
    let buttons = []
    if (quantity / divisors[0] != quantity) {
        buttons.push(buyButtonBuilder(interaction, quantity / divisors[0], threadid))
    }
    const buyall = buyButtonBuilder(interaction, "all", threadid)
    buttons.push(buyall)

    const editbuttons = await interaction.client.buttons.get("edit_market_buy").data(interaction, interaction.user.id, threadid)

    const rowligne_1 = new ActionRowBuilder()
        .addComponents(buttons)
    const rowligne_2 = new ActionRowBuilder()
        .addComponents(editbuttons)
    await thread.send({ embeds: [embed], components: [rowligne_1, rowligne_2] })
}
async function market_bid_create(interaction = CommandInteraction.prototype) {
    const quantity = interaction.options.getInteger("quantity") || 1
    const formoney = interaction.options.getInteger("for")
}


// async function nameME(interaction = CommandInteraction.prototype) { }

module.exports = {
    marketAction: {
        offer: {
            create: market_offer_create
        },
        bid: {
            create: market_bid_create
        }
    }
}