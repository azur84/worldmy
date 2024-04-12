const { SlashCommandBuilder, ChannelType, CommandInteraction, AutocompleteInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, guild, PermissionFlagsBits } = require("discord.js");
const { Item } = require("../../bin/item");
const { embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const local = require("../../local.json").commands.config
const emojis = require("../../emojis.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setNameLocalizations(local.name)
        .setDescription("configure the bot")
        .setDescriptionLocalizations(local.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(C => C
            .setName("menu")
            .setNameLocalizations(local.menu.name)
            .setDescription("settings menu")
            .setDescriptionLocalizations(local.menu.description))
        .addSubcommandGroup(C => C
            .setName("exploration")
            .setNameLocalizations(local.exploration.name)
            .setDescription("setup /exploration")
            .setDescriptionLocalizations(local.exploration.description)
            .addSubcommand(C => C
                .setName("menu")
                .setNameLocalizations(local.exploration.panel.name)
                .setDescription("open exploration config menu")
                .setDescriptionLocalizations(local.exploration.panel.description))
            .addSubcommand(C => C
                .setName("add-place")
                .setNameLocalizations(local.exploration.add.name)
                .setDescription("add exploration place")
                .setDescriptionLocalizations(local.exploration.add.description)
                .addStringOption(C => C
                    .setName("id")
                    .setNameLocalizations(local.exploration.add.idopt.name)
                    .setDescription("place's id")
                    .setDescriptionLocalizations(local.exploration.add.idopt.description)
                    .setRequired(true))
                .addStringOption(C => C
                    .setName("name")
                    .setNameLocalizations(local.exploration.add.nameopt.name)
                    .setDescription("place's name")
                    .setDescriptionLocalizations(local.exploration.add.nameopt.description))
                .addStringOption(C => C
                    .setName("icon")
                    .setNameLocalizations(local.exploration.add.iconopt.name)
                    .setDescription("place's icon")
                    .setDescriptionLocalizations(local.exploration.add.iconopt.description))))
        .addSubcommandGroup(C => C
            .setName("general")
            .setNameLocalizations(local.general.name)
            .setDescription("general settings")
            .setDescriptionLocalizations(local.general.description)
            .addSubcommand(C => C
                .setName("group")
                .setNameLocalizations(local.general.group.name)
                .setDescription("define the bot channel group")
                .setDescriptionLocalizations(local.general.group.description)
                .addChannelOption(C => C
                    .setName("channelgroup")
                    .setNameLocalizations(local.general.group.channel.name)
                    .setDescription("the new bot channel group")
                    .setDescriptionLocalizations(local.general.group.channel.description)
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true))))
        .addSubcommandGroup(C => C
            .setName("item")
            .setNameLocalizations(local.item.name)
            .setDescription("item manager")
            .setDescriptionLocalizations(local.item.name)
            .addSubcommand(C => C
                .setName("add")
                .setNameLocalizations(local.item.add.name)
                .setDescription("create an item")
                .setDescriptionLocalizations(local.item.add.description)
                .addStringOption(C => C
                    .setName("id")
                    .setNameLocalizations(local.item.add.idopt.name)
                    .setDescription("item's id")
                    .setDescriptionLocalizations(local.item.add.idopt.description)
                    .setRequired(true))
                .addStringOption(C => C
                    .setName("name")
                    .setNameLocalizations(local.item.add.nameopt.name)
                    .setDescription("item's name")
                    .setDescriptionLocalizations(local.item.add.nameopt.description))
                .addStringOption(C => C
                    .setName("icon")
                    .setNameLocalizations(local.item.add.iconopt.name)
                    .setDescription("item's icon")
                    .setDescriptionLocalizations(local.item.add.iconopt.description)))
            .addSubcommand(C => C
                .setName("remove")
                .setNameLocalizations(local.item.remove.name)
                .setDescription("remove an item")
                .setNameLocalizations(local.item.remove.description)
                .addStringOption(C => C
                    .setName("itemid")
                    .setNameLocalizations(local.item.remove.id.name)
                    .setDescription("the item's id")
                    .setDescriptionLocalizations(local.item.remove.id.description)
                    .setAutocomplete(true)
                    .setRequired(true)))
            .addSubcommand(C => C
                .setName("edit")
                .setNameLocalizations(local.item.edit.name)
                .setDescription("edit an item")
                .setDescriptionLocalizations(local.item.edit.description)
                .addStringOption(C => C
                    .setName("itemid")
                    .setNameLocalizations(local.item.edit.id.name)
                    .setDescription("the item's id")
                    .setDescriptionLocalizations(local.item.edit.id.description)
                    .setAutocomplete(true)
                    .setRequired(true))
                .addStringOption(C => C
                    .setName("modification")
                    .setNameLocalizations(local.item.edit.mod.name)
                    .setDescription("item's property to modify")
                    .setDescriptionLocalizations(local.item.edit.mod.description)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: "🎯 name",
                            value: "name",
                            name_localizations: local.item.edit.mod.choices[0]
                        },
                        {
                            name: "🖼️ icon",
                            value: "icon",
                            name_localizations: local.item.edit.mod.choices[1]
                        }
                    )
                )
                .addStringOption(C => C
                    .setName("value")
                    .setNameLocalizations(local.item.edit.value.name)
                    .setDescription("new item value")
                    .setDescriptionLocalizations(local.item.edit.value.description)
                    .setRequired(true)))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            case "item":
                switch (interaction.options.getSubcommand()) {
                    case "add":
                        const id = interaction.options.getString("id")
                        const name = interaction.options.getString("name") || id
                        const icon = interaction.options.getString("icon") || "📦"
                        try {
                            new Item.Builder(interaction.guildId, id)
                                .setIcon(icon)
                                .setName(name)
                                .create()
                            const embed = new EmbedBuilder()
                                .setColor(0x00B300)
                                .setTitle(local.item.name[interaction.locale] || "item")
                                .addFields(
                                    {
                                        name: local.item.add.idopt.name[interaction.locale] || "id",
                                        value: id,
                                        inline: true
                                    },
                                    {
                                        name: local.item.add.nameopt.name[interaction.locale] || "name",
                                        value: name,
                                        inline: true
                                    },
                                    {
                                        name: local.item.add.iconopt.name[interaction.locale] || "icon",
                                        value: icon,
                                        inline: true
                                    }
                                )
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message)], ephemeral: true })
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
                                .setTitle(local.item.name[interaction.locale] || "item")
                                .setDescription(`${local.item.edit.name[interaction.locale] || "edit"} : ${id}`)
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message)], ephemeral: true })
                        }
                        break
                    case "remove":
                        try {
                            const id = interaction.options.getString("itemid")
                            await Item.delete(interaction.guildId, id)
                            const embed = new EmbedBuilder()
                                .setColor(0x00B300)
                                .setTitle(local.item.name[interaction.locale] || "item")
                                .setDescription(`${local.item.remove.name[interaction.locale] || "remove"} : ${id}`)
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message)], ephemeral: true })
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
                            .setTitle(local.exploration.name[interaction.locale] || "exploration")
                            .setDescription(local.exploration.panel.reply[interaction.locale] || "setup exploration places")
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
                                .setTitle(local.exploration.name[interaction.locale] || "exploration")
                                .addFields(
                                    {
                                        name: local.exploration.add.idopt.name[interaction.locale] || "id",
                                        value: id,
                                        inline: true
                                    },
                                    {
                                        name: local.exploration.add.nameopt.name[interaction.locale] || "name",
                                        value: name,
                                        inline: true
                                    },
                                    {
                                        name: local.exploration.add.iconopt.name[interaction.locale] || "icon",
                                        value: icon,
                                        inline: true
                                    }
                                )
                            interaction.reply({ embeds: [embed] })
                        } catch (error) {
                            interaction.reply({ embeds: [embedError(error.message)], ephemeral: true })
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
                        interaction.reply({ embeds: [embedError("Unsuported command")], ephemeral: true })
                        break;
                }
                break;
        }

    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            case "itemid":
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