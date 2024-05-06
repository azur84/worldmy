const { SlashCommandBuilder, ChannelType, CommandInteraction, AutocompleteInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, guild, PermissionFlagsBits } = require("discord.js");
const { Item } = require("../../bin/item");
const { embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const { getMainTranslation, getAllTranslation, getTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("config"))
        .setNameLocalizations(getAllTranslation("config"))
        .setDescription(getMainTranslation("config_description"))
        .setDescriptionLocalizations(getAllTranslation("config_description"))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(C => C
            .setName(getMainTranslation("menu"))
            .setNameLocalizations(getAllTranslation("menu"))
            .setDescription(getMainTranslation("menu_description"))
            .setDescriptionLocalizations(getAllTranslation("menu_description")))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("exploration"))
            .setNameLocalizations(getAllTranslation("exploration"))
            .setDescription(getMainTranslation("exploration_description"))
            .setDescriptionLocalizations(getAllTranslation("exploration_description"))
            .addSubcommand(C => C
                .setName(getMainTranslation("menu"))
                .setNameLocalizations(getAllTranslation("menu"))
                .setDescription(getMainTranslation("exploration_menu_description"))
                .setDescriptionLocalizations(getAllTranslation("exploration_menu_description")))
            .addSubcommand(C => C
                .setName(getMainTranslation("add-place"))
                .setNameLocalizations(getAllTranslation("add-place"))
                .setDescription(getMainTranslation("add-place_description"))
                .setDescriptionLocalizations(getAllTranslation("add-place_description"))
                .addStringOption(C => C
                    .setName(getMainTranslation("id"))
                    .setNameLocalizations(getAllTranslation("id"))
                    .setDescription(getMainTranslation("opt_place.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_place.id"))
                    .setRequired(true))
                .addStringOption(C => C
                    .setName(getMainTranslation("name"))
                    .setNameLocalizations(getAllTranslation("name"))
                    .setDescription(getMainTranslation("opt_place.name"))
                    .setDescriptionLocalizations(getAllTranslation("opt_place.name")))
                .addStringOption(C => C
                    .setName(getMainTranslation("icon"))
                    .setNameLocalizations(getAllTranslation("icon"))
                    .setDescription(getMainTranslation("opt_place.icon"))
                    .setDescriptionLocalizations(getAllTranslation("opt_place.icon")))))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("general"))
            .setNameLocalizations(getAllTranslation("general"))
            .setDescription(getMainTranslation("general_description"))
            .setDescriptionLocalizations(getAllTranslation("general_description"))
            .addSubcommand(C => C
                .setName(getMainTranslation("group"))
                .setNameLocalizations(getAllTranslation("group"))
                .setDescription(getMainTranslation("group_channel_description"))
                .setDescriptionLocalizations(getAllTranslation("group_channel_description"))
                .addChannelOption(C => C
                    .setName(getMainTranslation("channel-group"))
                    .setNameLocalizations(getAllTranslation("channel-group"))
                    .setDescription(getMainTranslation("channel-group_description"))
                    .setDescriptionLocalizations(getAllTranslation("channel-group_description"))
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true))))
        .addSubcommandGroup(C => C
            .setName(getMainTranslation("item"))
            .setNameLocalizations(getAllTranslation("item"))
            .setDescription(getMainTranslation("item_manager"))
            .setDescriptionLocalizations(getAllTranslation("item_manager"))
            .addSubcommand(C => C
                .setName(getMainTranslation("add"))
                .setNameLocalizations(getAllTranslation("add"))
                .setDescription(getMainTranslation("create_item"))
                .setDescriptionLocalizations(getAllTranslation("create_item"))
                .addStringOption(C => C
                    .setName(getMainTranslation("id"))
                    .setNameLocalizations(getAllTranslation("id"))
                    .setDescription(getMainTranslation("opt_item.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.id"))
                    .setRequired(true))
                .addStringOption(C => C
                    .setName(getMainTranslation("name"))
                    .setNameLocalizations(getAllTranslation("name"))
                    .setDescription(getMainTranslation("opt_item.name"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.name")))
                .addStringOption(C => C
                    .setName(getMainTranslation("icon"))
                    .setNameLocalizations(getAllTranslation("icon"))
                    .setDescription(getMainTranslation("opt_item.icon"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.icon")))
                .addBooleanOption(o => o
                    .setName(getMainTranslation("producible"))
                    .setNameLocalizations(getAllTranslation("producible"))
                    .setDescription(getMainTranslation("producible_description"))
                    .setDescriptionLocalizations("producible_description")
                    .setRequired(false)))
            .addSubcommand(C => C
                .setName(getMainTranslation("remove"))
                .setNameLocalizations(getAllTranslation("remove"))
                .setDescription(getMainTranslation("remove_item"))
                .setDescriptionLocalizations(getAllTranslation("remove_item"))
                .addStringOption(C => C
                    .setName(getMainTranslation("item_id"))
                    .setNameLocalizations(getAllTranslation("item_id"))
                    .setDescription(getMainTranslation("opt_item.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.id"))
                    .setAutocomplete(true)
                    .setRequired(true)))
            .addSubcommand(C => C
                .setName(getMainTranslation("edit"))
                .setNameLocalizations(getAllTranslation("edit"))
                .setDescription(getMainTranslation("edit_item"))
                .setDescriptionLocalizations(getAllTranslation("edit_item"))
                .addStringOption(C => C
                    .setName(getMainTranslation("item_id"))
                    .setNameLocalizations(getAllTranslation("item_id"))
                    .setDescription(getMainTranslation("opt_item.id"))
                    .setDescriptionLocalizations(getAllTranslation("opt_item.id"))
                    .setAutocomplete(true)
                    .setRequired(true))
                .addStringOption(C => C
                    .setName(getMainTranslation("modification"))
                    .setNameLocalizations(getAllTranslation("modification"))
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
                    .setName(getMainTranslation("value"))
                    .setNameLocalizations(getAllTranslation("value"))
                    .setDescription(getMainTranslation("new_item_value"))
                    .setDescriptionLocalizations(getAllTranslation("new_item_value"))
                    .setRequired(true)))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            case "item":
                switch (interaction.options.getSubcommand()) {
                    case "add":
                        const id = interaction.options.getString("id")
                        const name = interaction.options.getString("name") || id
                        const icon = interaction.options.getString("icon") || "📦"
                        const producible = interaction.options.getBoolean("producible") || false
                        try {
                            new Item.Builder(interaction.guildId, id)
                                .setIcon(icon)
                                .setName(name)
                                .setProducible(producible)
                                .create()
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
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
                        }
                        break;
                    case "edit":
                        try {
                            const id = interaction.options.getString("itemid")
                            const mod = interaction.options.getString('modification')
                            const value = interaction.options.getString('value')
                            const item = await Item.getItemById(interaction.guildId, id)
                            item[mod] = value
                            item.save()
                            const embed = new EmbedBuilder()
                                .setColor(0x00B300)
                                .setTitle(getTranslation("item", interaction.locale))
                                .setDescription(`${getTranslation("edit", interaction.locale)} : ${id}`)
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
                        }
                        break
                    case "remove":
                        try {
                            const id = interaction.options.getString("itemid")
                            await Item.delete(interaction.guildId, id)
                            const embed = new EmbedBuilder()
                                .setColor(0x00B300)
                                .setTitle(getTranslation("item", interaction.locale))
                                .setDescription(`${getTranslation("remove", interaction.locale)} : ${id}`)
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
                        }
                        break
                    default:
                        break;
                }
                break;
            case "exploration":
                switch (interaction.options.getSubcommand()) {
                    case "menu":
                        const menu = await interaction.client.selectmenus.get("selectplace").data(interaction, interaction.user.id)
                        const row = new ActionRowBuilder()
                            .addComponents(menu)
                        const embed = new EmbedBuilder()
                            .setColor(0x00B300)
                            .setTitle(getTranslation("exploration", interaction.locale))
                            .setDescription(getTranslation("setup_exploration", interaction.locale))
                        await interaction.reply({ components: [row], embeds: [embed] })
                        break;
                    case "add-place":
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
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message, interaction.locale)], ephemeral: true })
                        }
                        break
                    default:
                        break;
                }
                break
            default:
                switch (interaction.options.getSubcommand()) {
                    // case "exploration":

                    //     break;
                    default:
                        interaction.reply({ embeds: [embedError("Unsuported command", interaction.locale)], ephemeral: true })
                        break;
                }
                break;
        }

    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            case "item_id":
                const focusedValue = interaction.options.getFocused();
                const items = await Item.getGuildsItems(interaction.guildId)
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
                    filtered.map(choice => ({ name: `${choice.icon} ${choice.name}`, value: choice.id })),
                )
                break;
            default:
                await interaction.respond()
                break;
        }

    }
}