const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { timeout, deleteData } = require("../../bin/data");
const { Place } = require("../../bin/exploration");
const { embedError } = require("../../bin/fastconst");
const local = require("../../local.json").commands.exploration
const otherlocal = require("../../local.json").other

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exploration")
        .setNameLocalizations(local.name)
        .setDescription("exploration command")
        .setDescriptionLocalizations(local.description)
        .addSubcommand(c => c
            .setName("start")
            .setDescriptionLocalizations(local.start.name)
            .setDescription("start a exploration")
            .setDescriptionLocalizations(local.start.description)),
    async execute(interaction = CommandInteraction.prototype) {
        switch (interaction.options.getSubcommandGroup()) {
            default:
                switch (interaction.options.getSubcommand()) {
                    case "start":
                        const timeo = await timeout(interaction.guildId, "exploration", interaction.user.id, 7200)
                        if (timeo) {
                            const embed = new EmbedBuilder()
                                .setColor(0x006699)
                                .setTitle(local.name[interaction] || "exploration")
                                .addFields([
                                    {
                                        name: otherlocal.timeout[interaction.locale] || "time out:",
                                        value: `<t:${timeo}:R>`
                                    }
                                ])
                            interaction.reply({ ephemeral: true, embeds: [embed] })
                        } else {
                            const places = await Place.getGuildsPlaces(interaction.guildId)
                            switch (places.length) {
                                case 0:
                                    interaction.reply({ ephemeral: true, embeds: [embedError(`${local.name[interaction.locale] || "exploration"} ${otherlocal.disabled[interaction.locale] || "disabled"}`)] })
                                    await deleteData(interaction.guildId, "exploration", interaction.user.id, false)
                                    break
                                case 1:
                                    const embed = new EmbedBuilder()
                                        .setColor(0x00cc66)
                                        .setTitle(local.name[interaction] || "exploration")
                                        .setDescription(local.start.reply[interaction] || "exploration success")
                                    interaction.reply({ ephemeral: true, embeds: [embed] })
                                    break
                                default:
                                    const embedselect = new EmbedBuilder()
                                        .setColor(0x00cc66)
                                        .setTitle(local.name[interaction] || "exploration")
                                        .setDescription(local.start.reply[interaction] || "exploration success")
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