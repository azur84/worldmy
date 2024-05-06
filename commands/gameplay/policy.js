const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction, MessageReaction } = require("discord.js");
const { timeout, deleteData, writeData, getData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("policy"))
        .setNameLocalizations(getAllTranslation("policy"))
        .setDescription(getMainTranslation("policy_description"))
        .setDescriptionLocalizations(getAllTranslation("policy_description"))
        .addSubcommandGroup(g => g
            .setName(getMainTranslation("taxe"))
            .setNameLocalizations(getAllTranslation("taxe"))
            .setDescription(getMainTranslation("defining_taxes"))
            .setDescriptionLocalizations(getAllTranslation("defining_taxes"))
            .addSubcommand(c => c
                .setName(getMainTranslation("housing"))
                .setNameLocalizations(getAllTranslation("housing"))
                .setDescription(getMainTranslation("define_taxes.housing"))
                .setDescriptionLocalizations(getAllTranslation("define_taxes.housing"))
                .addNumberOption(o => o
                    .setName(getMainTranslation("value"))
                    .setNameLocalizations(getAllTranslation("value"))
                    .setDescription(getMainTranslation("taxes_description.housing"))
                    .setDescriptionLocalizations(getAllTranslation("taxes_description.housing"))
                    .setMaxValue(100)
                    .setMinValue(0)))
            .addSubcommand(c => c
                .setName(getMainTranslation("production"))
                .setNameLocalizations(getAllTranslation("production"))
                .setDescription(getMainTranslation("define_taxes.production"))
                .setDescriptionLocalizations(getAllTranslation("define_taxes.production"))
                .addNumberOption(o => o
                    .setName(getMainTranslation("value"))
                    .setNameLocalizations(getAllTranslation("value"))
                    .setDescription(getMainTranslation("taxes_description.production"))
                    .setDescriptionLocalizations(getAllTranslation("taxes_description.production"))
                    .setMaxValue(100)
                    .setMinValue(0)))
            .addSubcommand(c => c
                .setName(getMainTranslation("vat"))
                .setNameLocalizations(getAllTranslation("vat"))
                .setDescription(getMainTranslation("define_taxes.vat"))
                .setDescriptionLocalizations(getAllTranslation("define_taxes.vat"))
                .addNumberOption(o => o
                    .setName(getMainTranslation("value"))
                    .setNameLocalizations(getAllTranslation("value"))
                    .setDescription(getMainTranslation("taxes_description.vat"))
                    .setDescriptionLocalizations(getAllTranslation("taxes_description.vat"))
                    .setMaxValue(100)
                    .setMinValue(0))))
        .addSubcommand(c => c
            .setName(getMainTranslation("menu"))
            .setNameLocalizations(getAllTranslation("menu"))
            .setDescription(getMainTranslation("policy_menu_description"))
            .setDescriptionLocalizations(getAllTranslation("policy_menu_description"))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            case "taxe":
                switch (interaction.options.getSubcommand()) {
                    case "menu":
                        
                        break
                    default:
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