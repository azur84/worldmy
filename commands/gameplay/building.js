const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction } = require("discord.js");
const { timeout, deleteData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("building"))
        .setNameLocalizations(getAllTranslation("building"))
        .setDescription(getMainTranslation("building_commands"))
        .setDescriptionLocalizations(getAllTranslation("building_commands"))
        .addSubcommandGroup(g => g
            .setName(getMainTranslation("area"))
            .setNameLocalizations(getAllTranslation("area"))
            .setDescription(getMainTranslation("area_commands"))
            .setDescriptionLocalizations(getAllTranslation("area_commands"))
            .addSubcommand(c => c
                .setName(getMainTranslation("create"))
                .setNameLocalizations(getAllTranslation("create"))
                .setDescription(getMainTranslation("create_area"))
                .setDescriptionLocalizations(getAllTranslation("create_area"))
                .addStringOption(o => o
                    .setName(getMainTranslation("type"))
                    .setNameLocalizations(getAllTranslation("type"))
                    .setDescription(getMainTranslation("type_area"))
                    .setDescriptionLocalizations(getAllTranslation("type_area"))
                    .setRequired(true)
                    .setChoices(
                        {
                            name: getMainTranslation("residential_area"),
                            value: "residential",
                            name_localizations: getAllTranslation("residential_area")
                        },
                        {
                            name: getMainTranslation("productive_area"),
                            value: "productive",
                            name_localizations: getAllTranslation("productive_area")
                        },
                        {
                            name: getMainTranslation("tertiary_area"),
                            value: "tertiary",
                            name_localizations: getAllTranslation("tertiary_area")
                        }
                    )
                )
                .addIntegerOption(o => o
                    .setName(getMainTranslation("number"))
                    .setNameLocalizations(getAllTranslation("number"))
                    .setDescription(getMainTranslation("number_area"))
                    .setDescriptionLocalizations(getAllTranslation("number_area"))
                    .setMinValue(1))))
        .addSubcommand(c => c
            .setName(getMainTranslation("build"))
            .setDescriptionLocalizations(getAllTranslation("build"))
            .setDescription(getMainTranslation("build_building"))
            .setDescriptionLocalizations(getAllTranslation("build_building"))
            .addStringOption(o => o
                .setName(getMainTranslation("building"))
                .setNameLocalizations(getAllTranslation("building"))
                .setDescription(getMainTranslation("building_to_build"))
                .setDescriptionLocalizations(getAllTranslation("building_to_build"))
                .setAutocomplete(true)
                .setRequired(true))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            default:
                switch (interaction.options.getSubcommand()) {
                    case "build":
                        break;
                    default:
                        break;
                }
                break
        }
    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            case "building":
                const focusedValue = interaction.options.getFocused();
                const items = await Building.getGuildsBuildings(interaction.guildId)
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