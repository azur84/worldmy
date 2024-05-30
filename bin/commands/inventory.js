const { EmbedBuilder, CommandInteraction, ActionRowBuilder } = require("discord.js")
const { Item } = require("../item")
const { getTranslation } = require("../translation")
const { getData } = require("../data")
const { Inventory } = require("../inventory")

async function inventory_view(interaction = CommandInteraction.prototype) {
    const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
    const fieldsPromise = Object.entries(inv.toJSON()).map(async ([key, number], index) => {
        const item = await Item.findOne({
            where: {
                guildid: interaction.guildId,
                id: key,
            }
        })
        return {
            name: `${item}`,
            value: `${getTranslation("quantity", interaction.locale)} : ${number}`,
            inline: true
        }
    })
    const fields = await Promise.all(fieldsPromise)
    const embed = new EmbedBuilder()
        .setColor(0x00B300)
        .setTitle(getTranslation("item", interaction.locale))
        .addFields(fields)
    await interaction.reply({ embeds: [embed], ephemeral: true })
}

// async function nameME(interaction = CommandInteraction.prototype) { }

module.exports = {
    inventoryAction: {
        view: inventory_view
    }
}