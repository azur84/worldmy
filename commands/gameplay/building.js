const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction } = require("discord.js");
const { timeout, deleteData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation } = require("../../bin/translation");
const local = require("../../local.json").commands.building
const otherlocal = require("../../local.json").other

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("commands.building.name"))
        .setNameLocalizations(getMainTranslation("commands.building.name"))
        .setDescription(getMainTranslation("commands.building.description"))
        .setDescriptionLocalizations(local.description)
        .addSubcommandGroup(g => g
            .setName("area")
            .setNameLocalizations(local.area.name)
            .setDescription("area command")
            .setDescriptionLocalizations(local.area.description)
            .addSubcommand(c => c
                .setName("create")
                .setNameLocalizations(local.area.create.name)
                .setDescription("create an area")
                .setDescriptionLocalizations(local.area.create.description)
                .addStringOption(o => o
                    .setName("type")
                    .setNameLocalizations(local.area.create.type.name)
                    .setDescription("type of area")
                    .setDescriptionLocalizations(local.area.create.type.description)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: "👨‍👩‍👧‍👦 residential area",
                            value: "residential",
                            name_localizations: local.area.create.type.choices[0]
                        },
                        {
                            name: "👷 industrial area",
                            value: "industrial",
                            name_localizations: local.area.create.type.choices[1]
                        },
                        {
                            name: "🧑‍💼 tertiary area",
                            value: "tertiary",
                            name_localizations: local.area.create.type.choices[2]
                        }
                    )
                )
                .addIntegerOption(o => o
                    .setName("number")
                    .setNameLocalizations(local.area.create.number.name)
                    .setDescription("number of area")
                    .setDescriptionLocalizations(local.area.create.number.description)
                    .setMinValue(1))))
        .addSubcommand(c => c
            .setName("build")
            .setDescriptionLocalizations(local.build.name)
            .setDescription("build a building")
            .setDescriptionLocalizations(local.build.description)
            .addStringOption(o => o
                .setName("building")
                .setNameLocalizations(local.build.buildingopt.name)
                .setDescription("building to build")
                .setDescriptionLocalizations(local.build.buildingopt.description)
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