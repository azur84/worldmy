const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { timeout, deleteData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { getMainTranslation, getAllTranslation, getTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("exploration"))
        .setNameLocalizations(getAllTranslation("exploration"))
        .setDescription(getMainTranslation("exploration_command"))
        .setDescriptionLocalizations(getAllTranslation("exploration_command"))
        .addSubcommand(c => c
            .setName(getMainTranslation("start"))
            .setDescriptionLocalizations(getAllTranslation("start"))
            .setDescription(getMainTranslation("start_exploration"))
            .setDescriptionLocalizations(getAllTranslation("start_exploration"))),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            default:
                switch (interaction.options.getSubcommand()) {
                    case "start":
                        const timeo = await timeout(interaction.guildId, "exploration", interaction.user.id, 7200)
                        if (timeo) {
                            const embed = new EmbedBuilder()
                                .setColor(0x006699)
                                .setTitle(getTranslation("exploration", interaction.locale))
                                .addFields([
                                    {
                                        name: `${getTranslation("timeout", interaction.locale)} :`,
                                        value: `<t:${timeo}:R>`
                                    }
                                ])
                            interaction.reply({ ephemeral: true, embeds: [embed] })
                        } else {
                            const places = await Place.getGuildsPlaces(interaction.guildId)
                            switch (places.length) {
                                case 0:
                                    interaction.reply({ ephemeral: true, embeds: [embedError(getTranslation("exploration_disabled", interaction.locale))] })
                                    await deleteData(interaction.guildId, "exploration", interaction.user.id, false)
                                    break
                                case 1:
                                    const embed = new EmbedBuilder()
                                        .setColor(0x00cc66)
                                        .setTitle(getTranslation("exploration", interaction.locale))
                                        .setDescription(getTranslation("exploration_success", interaction.locale))
                                    interaction.reply({ ephemeral: true, embeds: [embed] })
                                    break
                                default:
                                    const embedselect = new EmbedBuilder()
                                        .setColor(0x00cc66)
                                        .setTitle(getTranslation("exploration", interaction.locale))
                                        .setDescription(getTranslation("exploration_success", interaction.locale))
                                    const menu = interaction.client.selectmenus.get("selectplace_exploration_start").data(interaction, places, interaction.user.id)
                                    const row = new ActionRowBuilder()
                                        .addComponents(menu)
                                    interaction.reply({ ephemeral: true, embeds: [embedselect], components: [row] })
                                    break
                            }

                        }
                        break;
                    default:
                        break;
                }
                break
        }
    }
}