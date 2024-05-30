const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction, MessageReaction } = require("discord.js");
const { timeout, deleteData, writeData, getData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");
const area_colors = {
    residential_area: 0xf300ff,
    productive_area: 0xffc000,
    tertiary_area: 0x2986cc
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("building", true))
        .setNameLocalizations(getAllTranslation("building",true))
        .setDescription(getMainTranslation("building_commands"))
        .setDescriptionLocalizations(getAllTranslation("building_commands"))
        .addSubcommandGroup(g => g
            .setName(getMainTranslation("area", true))
            .setNameLocalizations(getAllTranslation("area",true))
            .setDescription(getMainTranslation("area_commands"))
            .setDescriptionLocalizations(getAllTranslation("area_commands"))
            .addSubcommand(c => c
                .setName(getMainTranslation("create", true))
                .setNameLocalizations(getAllTranslation("create",true))
                .setDescription(getMainTranslation("create_area"))
                .setDescriptionLocalizations(getAllTranslation("create_area"))
                .addStringOption(o => o
                    .setName(getMainTranslation("type", true))
                    .setNameLocalizations(getAllTranslation("type",true))
                    .setDescription(getMainTranslation("type_area"))
                    .setDescriptionLocalizations(getAllTranslation("type_area"))
                    .setRequired(true)
                    .setChoices(
                        {
                            name: getMainTranslation("residential_area"),
                            value: "residential_area",
                            name_localizations: getAllTranslation("residential_area")
                        },
                        {
                            name: getMainTranslation("productive_area"),
                            value: "productive_area",
                            name_localizations: getAllTranslation("productive_area")
                        },
                        {
                            name: getMainTranslation("tertiary_area"),
                            value: "tertiary_area",
                            name_localizations: getAllTranslation("tertiary_area")
                        }
                    )
                )
                .addIntegerOption(o => o
                    .setName(getMainTranslation("number", true))
                    .setNameLocalizations(getAllTranslation("number",true))
                    .setDescription(getMainTranslation("number_area"))
                    .setDescriptionLocalizations(getAllTranslation("number_area"))
                    .setMinValue(1))
            )
            .addSubcommand(c => c
                .setName(getMainTranslation("remove", true))
                .setNameLocalizations(getAllTranslation("remove",true))
                .setDescription(getMainTranslation("remove_area"))
                .setDescriptionLocalizations(getAllTranslation("remove_area"))
                .addStringOption(o => o
                    .setName(getMainTranslation("type", true))
                    .setNameLocalizations(getAllTranslation("type",true))
                    .setDescription(getMainTranslation("type_area"))
                    .setDescriptionLocalizations(getAllTranslation("type_area"))
                    .setRequired(true)
                    .setChoices(
                        {
                            name: getMainTranslation("residential_area"),
                            value: "residential_area",
                            name_localizations: getAllTranslation("residential_area")
                        },
                        {
                            name: getMainTranslation("productive_area"),
                            value: "productive_area",
                            name_localizations: getAllTranslation("productive_area")
                        },
                        {
                            name: getMainTranslation("tertiary_area"),
                            value: "tertiary_area",
                            name_localizations: getAllTranslation("tertiary_area")
                        }
                    )
                )
                .addIntegerOption(o => o
                    .setName(getMainTranslation("number", true))
                    .setNameLocalizations(getAllTranslation("number",true))
                    .setDescription(getMainTranslation("number_area"))
                    .setDescriptionLocalizations(getAllTranslation("number_area"))
                    .setMinValue(1)
                )))
        .addSubcommand(c => c
            .setName(getMainTranslation("build", true))
            .setDescriptionLocalizations(getAllTranslation("build",true))
            .setDescription(getMainTranslation("build_building"))
            .setDescriptionLocalizations(getAllTranslation("build_building"))
            .addStringOption(o => o
                .setName(getMainTranslation("building", true))
                .setNameLocalizations(getAllTranslation("building",true))
                .setDescription(getMainTranslation("building_to_build"))
                .setDescriptionLocalizations(getAllTranslation("building_to_build"))
                .setAutocomplete(true)
                .setRequired(true))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            case getMainTranslation("area", true):
                const area_type = interaction.options.getString("type")
                const city = await getData(interaction.guildId, "city", interaction.user.id) || {}
                const number = interaction.options.getInteger("number") || 5
                if (!city.area) city.area = {}
                if (!city.area[area_type]) city.area[area_type] = 0
                if (interaction.options.getSubcommand() == "create") {
                    city.area[area_type] = city.area[area_type] + number
                } else {
                    city.area[area_type] = city.area[area_type] - number
                }
                await writeData(interaction.guildId, "city", interaction.user.id, city, false)
                const embed = new EmbedBuilder()
                    .setTitle(getTranslation("area", interaction.locale))
                    .setDescription(getTranslation(area_type, interaction.locale))
                    .setColor(area_colors[area_type])
                    .addFields([
                        { name: `${getTranslation("number")} :`, value: `${number}`, inline: true },
                        { name: `${getTranslation("total")} :`, value: `${city.area[area_type]}`, inline: true }
                    ])
                await interaction.reply({ ephemeral: true, embeds: [embed] })
                break
            default:
                switch (interaction.options.getSubcommand()) {
                    case getMainTranslation("build", true):
                        break;
                    default:
                        break;
                }
                break
        }
    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            case getMainTranslation("building", true):
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
                    filtered.map(choice => ({ name: `${choice.name}`, value: choice.id })),
                )
                break;
            default:
                await interaction.respond()
                break;
        }

    }
}