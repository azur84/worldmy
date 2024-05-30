const { SlashCommandBuilder, ChannelType, CommandInteraction, AutocompleteInteraction, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
const { Item } = require("../../bin/item");
const { embedError } = require("../../bin/fastconst");
const { Place } = require("../../bin/exploration");
const { getMainTranslation, getAllTranslation, getTranslation } = require("../../bin/translation");
const { getData } = require("../../bin/data");
const { marketAction } = require("../../bin/commands/market");
const { Inventory } = require("../../bin/inventory");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("market", true))
        .setNameLocalizations(getAllTranslation("market", true))
        .setDescription(getMainTranslation("market"))
        .setDescriptionLocalizations(getAllTranslation("market"))
        .setDMPermission(false)
        .addSubcommand(c => c
            .setName(getMainTranslation("sell", true))
            .setNameLocalizations(getAllTranslation("sell", true))
            .setDescription(getMainTranslation("sell_item"))
            .setDescriptionLocalizations(getAllTranslation("sell_item"))
            .addStringOption(o => o
                .setName(getMainTranslation("item", true))
                .setNameLocalizations(getAllTranslation("item", true))
                .setDescription(getMainTranslation("inventory_item"))
                .setDescriptionLocalizations(getAllTranslation("inventory_item"))
                .setRequired(true)
                .setAutocomplete(true)
            )
            .addIntegerOption(o => o
                .setName(getMainTranslation("for", true))
                .setNameLocalizations(getAllTranslation("for", true))
                .setDescription(getMainTranslation("for_market"))
                .setDescriptionLocalizations(getAllTranslation("for_market"))
                .setRequired(true)
            )
            .addIntegerOption(o => o
                .setName(getMainTranslation("quantity", true))
                .setNameLocalizations(getAllTranslation("quantity", true))
                .setDescription(getMainTranslation("number_item"))
                .setDescriptionLocalizations(getAllTranslation("number_item"))
                .setAutocomplete(true)
            )
        )
        .addSubcommand(c => c
            .setName(getMainTranslation("bid", true))
            .setNameLocalizations(getAllTranslation("bid", true))
            .setDescription(getMainTranslation("bid_description"))
            .setDescriptionLocalizations(getAllTranslation("bid_description"))
            .addNumberOption(o => o
                .setName(getMainTranslation("for", true))
                .setNameLocalizations(getAllTranslation("for", true))
                .setDescription(getMainTranslation("for_market"))
                .setDescriptionLocalizations(getAllTranslation("for_market"))
                .setRequired(true)
            )
            .addIntegerOption(o => o
                .setName(getMainTranslation("quantity", true))
                .setNameLocalizations(getAllTranslation("quantity", true))
                .setDescription(getMainTranslation("for_market"))
                .setDescriptionLocalizations(getAllTranslation("for_market"))
                .setAutocomplete(true)
            )
        ),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommand()) {
            case getMainTranslation("sell", true):
                marketAction.offer.create(interaction)
                break
            case getMainTranslation("offer", true):
                marketAction.bid.create(interaction)
                break
        }
    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            case getMainTranslation("item", true):
                const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
                const focusedValue = interaction.options.getFocused();
                const filter = Object.keys(inv.toJSON()).filter(choice => {
                    if (choice.includes(focusedValue)) return true
                    return false
                })
                const filtered = filter.slice(0, 24)
                await interaction.respond(
                    filtered.map(choice => ({ name: `${choice}`, value: choice })),
                )
                break;
            case getMainTranslation("quantity", true):
                // const inv = await Inventory.getInventoryById(interaction.guildId, interaction.user.id)
                // const focusedValue = interaction.options.getFocused();
                // const filter = Object.keys(inv).filter(choice => {
                //     if (choice.includes(focusedValue)) return true
                //     return false
                // })
                // const filtered = filter.slice(0, 24)
                // await interaction.respond(
                //     filtered.map(choice => ({ name: `${choice}`, value: choice })),
                // )
                break
        }
    }
}