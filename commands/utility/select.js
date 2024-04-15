const { SlashCommandBuilder, ChannelType, CommandInteraction, AutocompleteInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, guild, PermissionFlagsBits } = require("discord.js");
const { Item } = require("../../bin/item");
const { embedError, embedFastMessage } = require("../../bin/fastconst");
const { axios } = require("axios");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("select"))
        .setNameLocalizations(getAllTranslation("select"))
        .setDescription(getMainTranslation("select"))
        .setDescriptionLocalizations(getAllTranslation("select"))
        .addSubcommand(c => c
            .setName(getMainTranslation("item"))
            .setNameLocalizations(getAllTranslation("item"))
            .setDescription(getMainTranslation("select_item"))
            .setDescriptionLocalizations(getAllTranslation("select_item"))
            .addStringOption(o => o
                .setName(getMainTranslation("item_id"))
                .setNameLocalizations(getAllTranslation("item_id"))
                .setDescription(getMainTranslation("selected_item"))
                .setDescriptionLocalizations(getAllTranslation("selected_item"))
                .setAutocomplete(true)
                .setRequired(true))
            .addNumberOption(o => o
                .setName(getMainTranslation("number"))
                .setNameLocalizations(getAllTranslation("number"))
                .setDescription(getMainTranslation("number_selected_item"))
                .setDescriptionLocalizations(getAllTranslation("number_selected_item"))))
        .addSubcommand(c => c
            .setName(getMainTranslation("file"))
            .setNameLocalizations(getAllTranslation("file"))
            .setDescription(getMainTranslation("upload_file"))
            .setDescriptionLocalizations(getAllTranslation("upload_file"))
            .addAttachmentOption(o => o
                .setName(getMainTranslation("file"))
                .setNameLocalizations(getAllTranslation("file"))
                .setDescription(getMainTranslation("file_to_upload"))
                .setDescriptionLocalizations(getAllTranslation("file_to_upload"))
                .setRequired(true))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommand()) {
            case "item":
                const id = interaction.options.getString("itemid")
                const number = interaction.options.getNumber("number") || 1
                if (!interaction.client.select.get(interaction.user.id)) {
                    interaction.reply({ embeds: [embedError(getTranslation("missing_interaction", interaction.locale))], ephemeral: true })
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
                    interaction.reply({ embeds: [embedError(getTranslation("bad_format", interaction.locale))], ephemeral: true })
                    return
                }
                if (!interaction.client.select.get(interaction.user.id)) {
                    interaction.reply({ embeds: [embedError(getTranslation("missing_interaction", interaction.locale))], ephemeral: true })
                } else {
                    interaction.reply({ embeds: [embedFastMessage(`${getTranslation("file")} : ${file.name}`)], ephemeral: true })
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