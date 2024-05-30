const { SlashCommandBuilder, ChannelType, CommandInteraction, AutocompleteInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const { Item } = require("../../bin/item");
const { embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const { getMainTranslation, getAllTranslation, getTranslation } = require("../../bin/translation");
const { writeData } = require("../../bin/data");
const { configAction } = require("../../bin/commands/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("config", true))
        .setNameLocalizations(getAllTranslation("config", true))
        .setDescription(getMainTranslation("config_description"))
        .setDescriptionLocalizations(getAllTranslation("config_description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(C => C
            .setName(getMainTranslation("menu", true))
            .setNameLocalizations(getAllTranslation("menu", true))
            .setDescription(getMainTranslation("menu_description"))
            .setDescriptionLocalizations(getAllTranslation("menu_description")))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("exploration", true))
            .setNameLocalizations(getAllTranslation("exploration", true))
            .setDescription(getMainTranslation("exploration_description"))
            .setDescriptionLocalizations(getAllTranslation("exploration_description"))
            .addSubcommand(C => C
                .setName(getMainTranslation("menu", true))
                .setNameLocalizations(getAllTranslation("menu", true))
                .setDescription(getMainTranslation("exploration_menu_description"))
                .setDescriptionLocalizations(getAllTranslation("exploration_menu_description")))
            .addSubcommand(C => C
                .setName(getMainTranslation("add-place", true))
                .setNameLocalizations(getAllTranslation("add-place", true))
                .setDescription(getMainTranslation("add-place_description"))
                .setDescriptionLocalizations(getAllTranslation("add-place_description"))
                .addStringOption(C => C
                    .setName(getMainTranslation("id", true))
                    .setNameLocalizations(getAllTranslation("id", true))
                    .setDescription(getMainTranslation("opt_place.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_place.id"))
                    .setRequired(true))
                .addStringOption(C => C
                    .setName(getMainTranslation("name", true))
                    .setNameLocalizations(getAllTranslation("name", true))
                    .setDescription(getMainTranslation("opt_place.name"))
                    .setDescriptionLocalizations(getAllTranslation("opt_place.name")))
                .addStringOption(C => C
                    .setName(getMainTranslation("icon", true))
                    .setNameLocalizations(getAllTranslation("icon", true))
                    .setDescription(getMainTranslation("opt_place.icon"))
                    .setDescriptionLocalizations(getAllTranslation("opt_place.icon"))))
            .addSubcommand(C => C
                .setName(getMainTranslation("add-item-place", true))
                .setNameLocalizations(getAllTranslation("add-item-place", true))
                .setDescription(getMainTranslation("add-item-place-description"))
                .setDescriptionLocalizations(getAllTranslation("add-item-place-description"))
                .addStringOption(o => o
                    .setName(getMainTranslation("place", true))
                    .setNameLocalizations(getAllTranslation("place", true))
                    .setDescription(getMainTranslation("place-item-description"))
                    .setDescriptionLocalizations(getAllTranslation("place-item-description"))
                    .setRequired(true)
                    .setAutocomplete(true)
                )
                .addStringOption(o => o
                    .setName(getMainTranslation("item_id", true))
                    .setNameLocalizations(getAllTranslation("item_id", true))
                    .setDescription(getMainTranslation("item-place-decription"))
                    .setDescriptionLocalizations(getAllTranslation("item-place-decription"))
                    .setRequired(true)
                    .setAutocomplete(true)
                )
                .addIntegerOption(o => o
                    .setName(getMainTranslation("number", true))
                    .setNameLocalizations(getAllTranslation("number", true))
                    .setDescription(getMainTranslation("number_item"))
                    .setDescriptionLocalizations(getAllTranslation("number_item"))
                )
                .addNumberOption(o => o
                    .setName(getMainTranslation("pourcentage", true))
                    .setNameLocalizations(getAllTranslation("pourcentage", true))
                    .setDescription(getMainTranslation("pourcentage_place_description"))
                    .setDescriptionLocalizations(getAllTranslation("pourcentage_place_description"))
                )
            ))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("general", true))
            .setNameLocalizations(getAllTranslation("general", true))
            .setDescription(getMainTranslation("general_description"))
            .setDescriptionLocalizations(getAllTranslation("general_description"))
            .addSubcommand(C => C
                .setName(getMainTranslation("group", true))
                .setNameLocalizations(getAllTranslation("group", true))
                .setDescription(getMainTranslation("group_channel_description"))
                .setDescriptionLocalizations(getAllTranslation("group_channel_description"))
                .addChannelOption(C => C
                    .setName(getMainTranslation("channel-group", true))
                    .setNameLocalizations(getAllTranslation("channel-group", true))
                    .setDescription(getMainTranslation("channel-group_description"))
                    .setDescriptionLocalizations(getAllTranslation("channel-group_description"))
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true))))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("item", true))
            .setNameLocalizations(getAllTranslation("item", true))
            .setDescription(getMainTranslation("item_manager"))
            .setDescriptionLocalizations(getAllTranslation("item_manager"))
            .addSubcommand(C => C
                .setName(getMainTranslation("add", true))
                .setNameLocalizations(getAllTranslation("add", true))
                .setDescription(getMainTranslation("create_item"))
                .setDescriptionLocalizations(getAllTranslation("create_item"))
                .addStringOption(C => C
                    .setName(getMainTranslation("id", true))
                    .setNameLocalizations(getAllTranslation("id", true))
                    .setDescription(getMainTranslation("opt_item.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.id"))
                    .setRequired(true))
                .addStringOption(C => C
                    .setName(getMainTranslation("name", true))
                    .setNameLocalizations(getAllTranslation("name", true))
                    .setDescription(getMainTranslation("opt_item.name"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.name")))
                .addStringOption(C => C
                    .setName(getMainTranslation("icon", true))
                    .setNameLocalizations(getAllTranslation("icon", true))
                    .setDescription(getMainTranslation("opt_item.icon"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.icon")))
                .addBooleanOption(o => o
                    .setName(getMainTranslation("producible", true))
                    .setNameLocalizations(getAllTranslation("producible", true))
                    .setDescription(getMainTranslation("producible_description"))
                    .setDescriptionLocalizations(getAllTranslation("producible_description"))
                    .setRequired(false)))
            .addSubcommand(C => C
                .setName(getMainTranslation("remove", true))
                .setNameLocalizations(getAllTranslation("remove", true))
                .setDescription(getMainTranslation("remove_item"))
                .setDescriptionLocalizations(getAllTranslation("remove_item"))
                .addStringOption(C => C
                    .setName(getMainTranslation("item_id", true))
                    .setNameLocalizations(getAllTranslation("item_id", true))
                    .setDescription(getMainTranslation("opt_item.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.id"))
                    .setAutocomplete(true)
                    .setRequired(true)))
            .addSubcommand(C => C
                .setName(getMainTranslation("edit", true))
                .setNameLocalizations(getAllTranslation("edit", true))
                .setDescription(getMainTranslation("edit_item"))
                .setDescriptionLocalizations(getAllTranslation("edit_item"))
                .addStringOption(C => C
                    .setName(getMainTranslation("item_id", true))
                    .setNameLocalizations(getAllTranslation("item_id", true))
                    .setDescription(getMainTranslation("opt_item.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.id"))
                    .setAutocomplete(true)
                    .setRequired(true))
                .addStringOption(C => C
                    .setName(getMainTranslation("modification", true))
                    .setNameLocalizations(getAllTranslation("modification", true))
                    .setDescription(getMainTranslation("item_modification"))
                    .setDescriptionLocalizations(getAllTranslation("item_modification"))
                    .setRequired(true)
                    .setChoices(
                        {
                            name: getMainTranslation("choices.name"),
                            value: "name",
                            name_localizations: getAllTranslation("choices.name")
                        },
                        {
                            name: getMainTranslation("choices.icon"),
                            value: "icon",
                            name_localizations: getAllTranslation("choices.icon")
                        },
                        {
                            name: getMainTranslation("choices.producible"),
                            value: "producible",
                            name_localizations: getAllTranslation("choices.producible")
                        }
                    )
                )
                .addStringOption(C => C
                    .setName(getMainTranslation("value", true))
                    .setNameLocalizations(getAllTranslation("value", true))
                    .setDescription(getMainTranslation("new_item_value"))
                    .setDescriptionLocalizations(getAllTranslation("new_item_value"))
                    .setRequired(true))))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("market", true))
            .setNameLocalizations(getAllTranslation("market", true))
            .setDescription(getMainTranslation("market_description"))
            .setDescriptionLocalizations(getAllTranslation("market_description"))
            .addSubcommand(C => C
                .setName(getMainTranslation("forum", true))
                .setNameLocalizations(getAllTranslation("forum", true))
                .setDescription(getMainTranslation("market_forum_description"))
                .setDescriptionLocalizations(getAllTranslation("market_forum_description"))
                .addChannelOption(o => o
                    .setName(getMainTranslation("forum", true))
                    .setNameLocalizations(getAllTranslation("forum", true))
                    .setDescription(getMainTranslation("market_forum_option"))
                    .setDescriptionLocalizations(getAllTranslation("market_forum_option"))
                    .addChannelTypes(ChannelType.GuildForum)
                ))
            .addSubcommand(C => C
                .setName(getMainTranslation("disabled", true))
                .setNameLocalizations(getAllTranslation("disabled", true))
                .setDescription(getMainTranslation("disabled_market"))
                .setNameLocalizations(getAllTranslation("disabled_market")))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            case getMainTranslation("item", true):
                switch (interaction.options.getSubcommand()) {
                    case getMainTranslation("add", true):
                        await configAction.item.add(interaction)
                        break;
                    case "edit":
                        await configAction.item.edit(interaction)
                        break
                    case "remove":
                        await configAction.item.remove(interaction)
                        break
                }
                break
            case getMainTranslation("exploration", true):
                switch (interaction.options.getSubcommand()) {
                    case "menu":
                        await configAction.exploration.menu(interaction)
                        break;
                    case "add-place":
                        await configAction.exploration.add_place(interaction)
                        break
                    case getMainTranslation("add-item-place", true):
                        await configAction.exploration.add_item_place(interaction)
                        break
                }
                break
            case getMainTranslation("market", true):
                switch (interaction.options.getSubcommand()) {
                    case getMainTranslation("forum", true):
                        await configAction.market.forum()
                        break;
                    case getMainTranslation("disabled", true):
                        await configAction.market.disabled()
                        break
                }
            default:
                switch (interaction.options.getSubcommand()) {
                    // case getMainTranslation("exploration",true):
                    //     break;
                    default:
                        interaction.reply({ embeds: [embedError("Unsuported command", interaction.locale)], ephemeral: true })
                        break;
                }
                break
        }
    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            case getMainTranslation("item_id", true):
                const focusedValue = interaction.options.getFocused();
                const items = await Item.findAll({
                    where: {
                        guildid: interaction.guildId,
                        id: id,
                    }
                })
                const filter = items.filter(choice => {
                    if (choice.id.includes(focusedValue)) {
                        return true
                    } else if (choice.name.includes(focusedValue)) {
                        return true
                    }
                    return false
                })
                const filtered = filter.slice(0, 24)
                await interaction.respond(
                    filtered.map(choice => ({ name: `${choice.name}`, value: choice.id })),
                )
                break
            case getMainTranslation("place", true):
                const focusedValueb = interaction.options.getFocused();
                const places = await Place.getGuildsPlaces(interaction.guildId)
                const filterb = places.filter(choice => {
                    if (choice.id.includes(focusedValueb)) {
                        return true
                    } else if (choice.name.includes(focusedValueb)) {
                        return true
                    }
                    return false
                })
                const filteredb = filterb.slice(0, 24)
                await interaction.respond(
                    filteredb.map(choice => ({ name: `${choice.name}`, value: choice.id })),
                )
                break;
            default:
                await interaction.respond()
                break;
        }

    }
}