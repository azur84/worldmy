const { StringSelectMenuBuilder, BaseInteraction, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Place } = require("../../bin/exploration");
const { timeMessage } = require("../../bin/fastconst");
const local = require("../../local.json").selectmenus.selectplace

module.exports = {
    id: "selectplace",
    data(interaction = BaseInteraction.prototype) {
        const places = Place.getGuildsPlaces(interaction.guildId)
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
            .setCustomId("selectplace")
            .addOptions(options)
    },
    async execute(interaction = StringSelectMenuInteraction.prototype) {
        switch (interaction.values[0]) {
            case "cancel":
                await interaction.message.delete()
                break;
            default:
                const item = interaction.client.buttons.get("addexplorationitem").data(interaction)
                item.setCustomId(`addexplorationitem@placeId=${interaction.values[0]}`)
                const cancel = interaction.client.buttons.get("cancel_exploration").data(interaction)
                const row = new ActionRowBuilder()
                    .addComponents(item, cancel)
                const place = Place.getPlaceById(interaction.guildId, interaction.values[0])
                const embed = new EmbedBuilder()
                    .setColor(0x00B300)
                    .setTitle(local.reply.name[interaction.locale] || "exploration")
                    .setDescription(place.name)
                    .addFields([
                        {
                            name: 'Id :', value: place.id
                        },
                        {
                            name: "Icon :", value: place.icon
                        }
                    ])
                const load = await timeMessage(interaction, "loading")
                await interaction.message.edit({ components: [row], embeds: [embed] })
                await load()
                break;
        }
    },

}