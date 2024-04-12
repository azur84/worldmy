const { EmbedBuilder } = require("discord.js")
const local = require("../local.json").other

function embedError(error, userlocal) {
    return new EmbedBuilder()
        .setColor(0xcc0000)
        .setTitle(`❌ ${local.error[userlocal] || "error"}`)
        .setDescription(error)
}
async function timeMessage(interaction, me) {
    const embed = new EmbedBuilder()
        .setColor(0xAFEEEE)
        .setTitle("📣")
        .setDescription(me)
    await interaction.reply({
        embeds: [embed]
    })
    return async () => await interaction.deleteReply()
}
function embedFastMessage(me) {
    const embed = new EmbedBuilder()
        .setColor(0xAFEEEE)
        .setTitle("📣")
        .setDescription(me)
    return embed
}
module.exports = {
    embedError,
    timeMessage,
    embedFastMessage
}