const { SlashCommandBuilder, ChannelType, CommandInteraction, AutocompleteInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, guild, PermissionFlagsBits } = require("discord.js");
const { Item } = require("../../bin/item");
const { embedError, embedFastMessage } = require("../../bin/fastconst");
const { default: axios } = require("axios");
const local = require("../../local.json").commands.select

module.exports = {
    data: new SlashCommandBuilder()
        .setName("select")
        .setNameLocalizations(local.name)
        .setDescription("select")
        .setDescriptionLocalizations(local.description)
        .addSubcommand(c => c
            .setName("item")
            .setNameLocalizations(local.item.name)
            .setDescription("select item")
            .setDescriptionLocalizations(local.item.description)
            .addStringOption(o => o
                .setName("itemid")
                .setNameLocalizations(local.item.itemopt.name)
                .setDescription("selected item")
                .setDescriptionLocalizations(local.item.itemopt.description)
                .setAutocomplete(true)
                .setRequired(true))
            .addNumberOption(o => o
                .setName("number")
                .setNameLocalizations(local.item.numberopt.name)
                .setDescription("number of selected item")
                .setDescriptionLocalizations(local.item.numberopt.description)))
        .addSubcommand(c => c
            .setName("file")
            .setNameLocalizations(local.file.name)
            .setDescription("upload a file")
            .setDescriptionLocalizations(local.file.description)
            .addAttachmentOption(o => o
                .setName("file")
                .setNameLocalizations(local.file.fileopt.name)
                .setDescription("the file to upload")
                .setDescriptionLocalizations(local.file.fileopt.description)
                .setRequired(true))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommand()) {
            case "item":
                const id = interaction.options.getString("itemid")
                const number = interaction.options.getNumber("number") || 1
                if (!interaction.client.select.get(interaction.user.id)) {
                    interaction.reply({ embeds: [embedError("missing bot interaction")], ephemeral: true })
                } else {
                    interaction.client.select.get(interaction.user.id)?.("item", id, number)
                    const item = await Item.getItemById(interaction.guildId, id)
                    interaction.reply({ embeds: [embedFastMessage(`${number} ${item.icon}${item.name}`)], ephemeral: true })
                }
                break;
            case "file":
                const extension = ["json"]
                const file = interaction.options.getAttachment("file")
                const split = file.name.split(".")
                if (!extension.includes(split[split.length - 1])) {
                    interaction.reply({ embeds: [embedError("bad file format")], ephemeral: true })
                    return
                }
                if (!interaction.client.select.get(interaction.user.id)) {
                    interaction.reply({ embeds: [embedError("missing bot interaction")], ephemeral: true })
                } else {
                    interaction.reply({ embeds: [embedFastMessage(`file : ${file.name}`)], ephemeral: true })
                    const { data } = await axios.get(file.url)
                    interaction.client.select.get(interaction.user.id)?.("file", file.name, data)
                }
                break
            default:
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