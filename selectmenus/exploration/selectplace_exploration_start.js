const { StringSelectMenuBuilder, BaseInteraction, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Place, startExploration } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { paramCustomId } = require("../../bin/utility");
const { getTranslation } = require("../../bin/translation");
const { setDataTimeout } = require("../../bin/data");

module.exports = {
    id: "selectplace_exploration_start",
    data(interaction = BaseInteraction.prototype, list, userId) {
        const places = list
        let options = []
        places.forEach((e) => {
            options.push(new StringSelectMenuOptionBuilder()
                .setLabel(e.name)
                .setValue(e.id)
                .setEmoji(e.icon))
        })
        return new StringSelectMenuBuilder()
            .setCustomId(`selectplace_exploration_start@userid=${userId}`)
            .addOptions(options)
    },
    async execute(interaction = StringSelectMenuInteraction.prototype) {
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(getTranslation("owner_error", interaction.locale), interaction.locale)] })
            return
        }
        const value = interaction.values[0]
        const place = await Place.getPlaceById(interaction.guildId, value)
        const exploration = await startExploration(interaction, value)
        const embed = new EmbedBuilder()
            .setColor(0x00cc66)
            .setTitle(getTranslation("exploration", interaction.locale))
            .setDescription(getTranslation("exploration_success", interaction.locale))
            .addFields([{ name: `${place.icon} ${place.name}`, value: `\u200B` }])
            .addFields(exploration)
        await interaction.message.edit({ ephemeral: true, embeds: [embed], components: [] })
        await setDataTimeout(interaction.guildId, "exploration", interaction.user.id, 7200)
    }
}