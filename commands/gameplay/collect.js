const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction, MessageReaction } = require("discord.js");
const { timeout, deleteData, writeData, getData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(getMainTranslation("collect"))
    .setNameLocalizations(getAllTranslation("collect"))
    .setDescription(getMainTranslation("collect_description"))
    .setDescriptionLocalizations(getAllTranslation("collect_description")),
    async execute(interaction = CommandInteraction.prototype) {
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