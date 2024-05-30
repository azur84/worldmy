const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, AutocompleteInteraction, MessageReaction } = require("discord.js");
const { timeout, deleteData, writeData, getData, setDataTimeout, getDataTimeout } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { Building } = require("../../bin/building");
const { getTranslation, getMainTranslation, getAllTranslation } = require("../../bin/translation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getMainTranslation("collect", true))
        .setNameLocalizations(getAllTranslation("collect", true))
        .setDescription(getMainTranslation("collect_description"))
        .setDescriptionLocalizations(getAllTranslation("collect_description")),
    async execute(interaction = CommandInteraction.prototype) {
        const timeo = await getDataTimeout(interaction.guildId, "collect", interaction.user.id)
        if (!timeo) {
            const city = await getData(interaction.guildId, "city", interaction.user.id) || {}
            const time = Math.floor((new Date().setUTCHours(24, 0, 0, 0) - new Date().getTime()) / 1000)
            await setDataTimeout(interaction.guildId, "collect", interaction.user.id, time)
        } else {
            const embed = new EmbedBuilder()
                .setColor(0x006699)
                .setTitle(getTranslation("collect", interaction.locale))
                .addFields([
                    {
                        name: `${getTranslation("timeout", interaction.locale)} :`,
                        value: `<t:${timeo}:R>`
                    }
                ])
            interaction.reply({ ephemeral: true, embeds: [embed] })
        }
    },
    async autocomplete(interaction = AutocompleteInteraction.prototype) {
        switch (interaction.options.getFocused(true).name) {
            default:
                await interaction.respond()
                break;
        }

    }
}