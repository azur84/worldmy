const { StringSelectMenuBuilder, BaseInteraction, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const { paramCustomId } = require("../../bin/utility");
const { getTranslation } = require("../../bin/translation");

module.exports = {
    id: "selectplace",
    async data(interaction = BaseInteraction.prototype, userid) {
        const places = await Place.getGuildsPlaces(interaction.guildId)
        const cancel = new StringSelectMenuOptionBuilder()
            .setLabel("cancel")
            .setEmoji("❌")
            .setValue("cancel")
        let options = [cancel]
        places.forEach((e) => {
            options.push(new StringSelectMenuOptionBuilder()
                .setLabel(e.name)
                .setValue(e.id)
                .setEmoji(e.icon))
        })
        return new StringSelectMenuBuilder()
            .setCustomId(`selectplace@userid=${userid}`)
            .addOptions(options)
    },
    async execute(interaction = StringSelectMenuInteraction.prototype) {
        await interaction.deferUpdate()
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(getTranslation("owner_error", interaction.locale), interaction.locale)] })
            return
        }
        switch (interaction.values[0]) {
            case "cancel":
                await interaction.message.delete()
                break;
            default:
                const placeid = interaction.values[0]
                const item = interaction.client.buttons.get("addexplorationitem").data(interaction, interaction.values[0], parm.userid)
                const cancel = interaction.client.buttons.get("cancel_exploration").data(interaction, parm.userid)
                const remove = interaction.client.buttons.get("remove_place").data(interaction, parm.userid, placeid)
                const row = new ActionRowBuilder()
                    .addComponents(item, remove)
                const row2 = new ActionRowBuilder()
                    .addComponents(cancel)
                const place = await Place.getPlaceById(interaction.guildId, placeid)
                const embed = new EmbedBuilder()
                    .setColor(0x00B300)
                    .setTitle(getTranslation("exploration", interaction.locale))
                    .setDescription(place.name)
                    .addFields([
                        {
                            name: `${getTranslation("id", interaction.locale)} :`, value: place.id
                        },
                        {
                            name: `${getTranslation("icon", interaction.locale)} :`, value: place.icon
                        }
                    ])
                await interaction.message.edit({ components: [row,row2], embeds: [embed] })
                break;
        }
    },

}