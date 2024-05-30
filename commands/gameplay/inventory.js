const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const { getMainTranslation, getAllTranslation, } = require("../../bin/translation");
const { inventoryAction } = require("../../bin/commands/inventory");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("inventory", true))
        .setNameLocalizations(getAllTranslation("inventory", true))
        .setDescription(getMainTranslation("inventory_description"))
        .setDescriptionLocalizations(getAllTranslation("inventory_description")),
    async execute(interaction = CommandInteraction.prototype) {
        await inventoryAction.view(interaction)
    }
}