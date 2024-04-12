const { StringSelectMenuBuilder, BaseInteraction, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Place } = require("../../bin/exploration");
const { timeMessage, embedError } = require("../../bin/fastconst");
const { paramCustomId } = require("../../bin/utility");
const local = require("../../local.json").selectmenus.selectplace
const otherlocal = require("../../local.json").other

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
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(otherlocal.ownermessage[interaction.locale] || "You are not my owner.", interaction.locale)] })
            return
        }
        switch (interaction.values[0]) {
            case "cancel":
                await interaction.message.delete()
                break;
            default:
                const item = interaction.client.buttons.get("addexplorationitem").data(interaction, interaction.values[0], parm.userid)
                const cancel = interaction.client.buttons.get("cancel_exploration").data(interaction, parm.userid)
                const row = new ActionRowBuilder()
                    .addComponents(item, cancel)
                const place = await Place.getPlaceById(interaction.guildId, interaction.values[0])
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