const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction, MessageReaction } = require("discord.js");
const { timeout, deleteData, writeData, getData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("policy", true))
        .setNameLocalizations(getAllTranslation("policy", true))
        .setDescription(getMainTranslation("policy_description"))
        .setDescriptionLocalizations(getAllTranslation("policy_description"))
        .addSubcommandGroup(g => g
            .setName(getMainTranslation("taxes", true))
            .setNameLocalizations(getAllTranslation("taxes", true))
            .setDescription(getMainTranslation("defining_taxes"))
            .setDescriptionLocalizations(getAllTranslation("defining_taxes"))
            .addSubcommand(c => c
                .setName(getMainTranslation("civil", true))
                .setNameLocalizations(getAllTranslation("civil", true))
                .setDescription(getMainTranslation("define_taxes.civil"))
                .setDescriptionLocalizations(getAllTranslation("define_taxes.civil"))
                .addNumberOption(o => o
                    .setName(getMainTranslation("value", true))
                    .setNameLocalizations(getAllTranslation("value", true))
                    .setDescription(getMainTranslation("taxes_description.civil"))
                    .setDescriptionLocalizations(getAllTranslation("taxes_description.civil"))
                    .setMaxValue(100)
                    .setMinValue(0)
                    .setRequired(true)))
            .addSubcommand(c => c
                .setName(getMainTranslation("production", true))
                .setNameLocalizations(getAllTranslation("production", true))
                .setDescription(getMainTranslation("define_taxes.production"))
                .setDescriptionLocalizations(getAllTranslation("define_taxes.production"))
                .addNumberOption(o => o
                    .setName(getMainTranslation("value", true))
                    .setNameLocalizations(getAllTranslation("value", true))
                    .setDescription(getMainTranslation("taxes_description.production"))
                    .setDescriptionLocalizations(getAllTranslation("taxes_description.production"))
                    .setMaxValue(100)
                    .setMinValue(0)
                    .setRequired(true)))
            .addSubcommand(c => c
                .setName(getMainTranslation("vat", true))
                .setNameLocalizations(getAllTranslation("vat", true))
                .setDescription(getMainTranslation("define_taxes.vat"))
                .setDescriptionLocalizations(getAllTranslation("define_taxes.vat"))
                .addNumberOption(o => o
                    .setName(getMainTranslation("value", true))
                    .setNameLocalizations(getAllTranslation("value", true))
                    .setDescription(getMainTranslation("taxes_description.vat"))
                    .setDescriptionLocalizations(getAllTranslation("taxes_description.vat"))
                    .setMaxValue(100)
                    .setMinValue(0)
                    .setRequired(true))))
        .addSubcommand(c => c
            .setName(getMainTranslation("menu", true))
            .setNameLocalizations(getAllTranslation("menu", true))
            .setDescription(getMainTranslation("policy_menu_description"))
            .setDescriptionLocalizations(getAllTranslation("policy_menu_description"))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            case getMainTranslation("taxe"):
                const city = await getData(interaction.guildId, "city", interaction.user.id) || {}
                const value = interaction.options.getNumber("value")
                if (!city.taxe) city.taxe = {}
                switch (interaction.options.getSubcommand()) {
                    case getMainTranslation("civil"):
                        city.taxe.civil = value
                        break
                    case getMainTranslation("vat"):
                        city.taxe.vat = value
                        break
                    case getMainTranslation("production"):
                        city.taxe.production = value
                        break
                }
                break
            default:
                switch (interaction.options.getSubcommand()) {
                    case getMainTranslation("menu"):

                        break
                    default:
                        break
                }
                break;
        }
        const city = await getData(interaction.guildId, "city", interaction.user.id) || {}

    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            default:
                await interaction.respond()
                break;
        }

    }
}