const { StringSelectMenuBuilder, BaseInteraction, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { Place } = require("../../bin/exploration");
const { timeMessage, embedError } = require("../../bin/fastconst");
const { paramCustomId } = require("../../bin/utility");
const local = require("../../local.json").commands.exploration
const otherlocal = require("../../local.json").other

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
            interaction.reply({ ephemeral: true, embeds: [embedError(otherlocal.ownermessage[interaction.locale] || "You are not my owner.", interaction.locale)] })
            return
        }
        const value = interaction.values[0]
        const place = await Place.getPlaceById(interaction.guildId, value)
        const embed = new EmbedBuilder()
            .setColor(0x00cc66)
            .setTitle(local.name[interaction] || "exploration")
            .setDescription(local.start.reply[interaction] || "exploration success")
            .addFields([{ name: `${place.icon} ${place.name}`, value: place.id }])
        interaction.message.edit({ ephemeral: true, embeds: [embed], components: [] })
    }
}