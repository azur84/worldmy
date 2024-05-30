const { EmbedBuilder, CommandInteraction, ActionRowBuilder } = require("discord.js")
const { Item } = require("../item")
const { embedError } = require("../fastconst")
const { getTranslation } = require("../translation")
const { Place } = require("../exploration")

async function item_add(interaction = CommandInteraction.prototype) {
    const id = interaction.options.getString("id")
    const name = interaction.options.getString("name") || id
    const icon = interaction.options.getString("icon") || "📦"
    const producible = interaction.options.getBoolean("producible") || false
    try {
        Item.create({
            guildid: interaction.guildId,
            id: id,
            name: name,
            icon: icon,
            producible: producible
        })
        const embed = new EmbedBuilder()
            .setColor(0x00B300)
            .setTitle(getTranslation("item", interaction.locale))
            .addFields(
                {
                    name: getTranslation("id", interaction.locale),
                    value: id,
                    inline: true
                },
                {
                    name: getTranslation("name", interaction.locale),
                    value: name,
                    inline: true
                },
                {
                    name: getTranslation("icon", interaction.locale),
                    value: icon,
                    inline: true
                },
                {
                    name: getTranslation("producible", interaction.locale),
                    value: producible,
                    inline: true
                }
            )
        await interaction.reply({ embeds: [embed] })
    } catch (error) {
        await interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
        console.error(error)
    }
}
async function item_edit(interaction = CommandInteraction.prototype) {
    try {
        const id = interaction.options.getString("itemid")
        const mod = interaction.options.getString('modification')
        const value = interaction.options.getString('value')
        const item = await Item.findOne({
            where: {
                guildid: interaction.guildId,
                id: id,
            }
        })
        item[mod] = value
        item.save()
        const embed = new EmbedBuilder()
            .setColor(0x00B300)
            .setTitle(getTranslation("item", interaction.locale))
            .setDescription(`${getTranslation("edit", interaction.locale)} : ${id}`)
        await interaction.reply({ embeds: [embed] })
    } catch (error) {
        await interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
    }

}
async function item_remove(interaction = CommandInteraction.prototype) {
    try {
        const id = interaction.options.getString("itemid")
        const item = await Item.findOne({
            where: {
                guildid: interaction.guildId,
                id: id,
            }
        })
        item.destroy()
        const embed = new EmbedBuilder()
            .setColor(0x00B300)
            .setTitle(getTranslation("item", interaction.locale))
            .setDescription(`${getTranslation("remove", interaction.locale)} : ${id}`)
        await interaction.reply({ embeds: [embed] })
    } catch (error) {
        await interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
    }

}

async function exploration_menu(interaction = CommandInteraction.prototype) {
    const menu = await interaction.client.selectmenus.get("selectplace").data(interaction, interaction.user.id)
    const row = new ActionRowBuilder()
        .addComponents(menu)
    const embed = new EmbedBuilder()
        .setColor(0x00B300)
        .setTitle(getTranslation("exploration", interaction.locale))
        .setDescription(getTranslation("setup_exploration", interaction.locale))
    await interaction.reply({ components: [row], embeds: [embed] })
}
async function exploration_add_place(interaction = CommandInteraction.prototype) {
    const id = interaction.options.getString("id")
    const name = interaction.options.getString("name") || id
    const iconstring = interaction.options.getString("icon")
    const icon = iconstring
    try {
        new Place.Builder(interaction.guildId, id)
            .setIcon(icon)
            .setName(name)
            .create()
        const embed = new EmbedBuilder()
            .setColor(0x00B300)
            .setTitle(getTranslation("exploration", interaction.locale))
            .addFields(
                {
                    name: getTranslation("id", interaction.locale),
                    value: id,
                    inline: true
                },
                {
                    name: getTranslation("name", interaction.locale),
                    value: name,
                    inline: true
                },
                {
                    name: getTranslation("icon", interaction.locale),
                    value: icon,
                    inline: true
                }
            )
        await interaction.reply({ embeds: [embed] })
    } catch (error) {
        await interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
    }
}
async function exploration_add_item_place(interaction = CommandInteraction.prototype) {
    const itemid = interaction.options.getString("item_id")
    const placeid = interaction.options.getString("place")
    const pourcentage = interaction.options.getNumber("pourcentage") || 100
    const number = interaction.options.getInteger("number") || 1
    const place = await Place.getPlaceById(interaction.guildId, placeid)
    const item = await Item.findOne({
        where: {
            guildid: interaction.guildId,
            id: itemid,
        }
    })
    place.addObtainableItem(item.id, pourcentage, number)
    await place.save()
    const embed = new EmbedBuilder()
        .setColor(0x00B300)
        .setTitle(getTranslation("exploration", interaction.locale))
        .setDescription(getTranslation("add-item-place-description", interaction.locale))
        .addFields([
            {
                name: getTranslation("name", interaction.locale),
                value: `${item.icon} ${item.name}`
            },
            {
                name: getTranslation("pourcentage", interaction.locale),
                value: `${pourcentage}%`,
                inline: true
            },
            {
                name: getTranslation("number", interaction.locale),
                value: `X${number}`,
                inline: true
            }
        ])
    await interaction.reply({ embeds: [embed] })
}

async function market_forum(interaction = CommandInteraction.prototype) {
    const forum = interaction.options.getChannel(getMainTranslation("forum", true))
    if (forum) {
        await writeData(interaction.guildId, "channels", "market", forum.id, false)
        const embed = new EmbedBuilder()
            .setColor(0x24eeee)
            .setTitle(getTranslation("market", interaction.locale))
            .setDescription(`${getTranslation("market_channel_set", interaction.locale)} ${forum}`)
        await interaction.reply({ embeds: [embed] })
    } else {
        const foru = await interaction.guild.channels.create({
            name: getTranslation("market", interaction.guildLocale),
            type: ChannelType.GuildForum,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [68719478784n]
                },
                {
                    id: interaction.client.user.id,
                    allow: [68719478784n, "ManageThreads"]
                }
            ]
        })
        await writeData(interaction.guildId, "channels", "market", foru.id, false)
        const embed = new EmbedBuilder()
            .setColor(0x24eeee)
            .setTitle(getTranslation("market", interaction.locale))
            .setDescription(`${getTranslation("market_channel_set", interaction.locale)} ${foru}`)
        await interaction.reply({ embeds: [embed] })
    }

}
async function market_disabled(interaction = CommandInteraction.prototype) {
    // to make
}

// async function nameME(interaction = CommandInteraction.prototype) { }

module.exports = {
    configAction: {
        item: {
            add: item_add,
            edit: item_edit,
            remove: item_remove
        },
        exploration: {
            menu: exploration_menu,
            add_place: exploration_add_place,
            add_item_place: exploration_add_item_place
        },
        market: {
            forum: market_forum,
            disabled: market_disabled
        }
    }
}