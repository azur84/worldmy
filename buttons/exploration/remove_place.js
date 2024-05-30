const { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { embedError } = require("../../bin/fastconst");
const { getTranslation } = require("../../bin/translation");
const { paramCustomId } = require("../../bin/utility");
const { Place } = require("../../bin/exploration");

module.exports = {
    id: "remove_place",
    data: (interaction, userid, placeid, valid = false) => new ButtonBuilder()
        .setCustomId(`remove_place@userid=${userid}&placeid=${placeid}&valid=${valid}`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🗑️")
        .setLabel(getTranslation("remove", interaction.locale)),
    async execute(interaction = ButtonInteraction.prototype) {
        await interaction.deferUpdate()
        const parm = paramCustomId(interaction.customId)
        if (parm.userid != interaction.user.id) {
            interaction.reply({ ephemeral: true, embeds: [embedError(getTranslation("owner_error", interaction.locale), interaction.locale)] })
            return
        }
        if (parm.valid === "true") {
            await Place.delete(interaction.guildId, parm.placeid)
            const menu = await interaction.client.selectmenus.get("selectplace").data(interaction, parm.userid)
            const row = new ActionRowBuilder()
                .addComponents(menu)
            const embed = new EmbedBuilder()
                .setColor(0x00B300)
                .setTitle(getTranslation("exploration", interaction.locale))
                .setDescription(`${getTranslation("exploration_menu_reply", interaction.locale)}`)
            await interaction.message.edit({ components: [row], embeds: [embed] })
        } else {
            const place = await Place.getPlaceById(interaction.guildId, parm.placeid)
            const remove = await interaction.client.buttons.get("remove_place").data(interaction, parm.userid, parm.placeid, true)
            const cancel = await interaction.client.buttons.get("cancel_exploration").data(interaction, parm.userid)
            cancel.setStyle(ButtonStyle.Primary)
            const row = new ActionRowBuilder()
                .addComponents(cancel, remove)
            const embed = new EmbedBuilder()
                .setColor(0x00B300)
                .setTitle(getTranslation("exploration", interaction.locale))
                .setDescription(`${getTranslation("are_sure_delete", interaction.locale)} ${place.name}`)
            await interaction.message.edit({ components: [row], embeds: [embed] })
        }
    }
}