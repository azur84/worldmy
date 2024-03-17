const { Events, BaseInteraction } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction = BaseInteraction.prototype) {
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId.match(/[^@]+/)[0]);
            if (!button) {
                console.error(`No button matching ${interaction.customId} was found.`);
                return;
            }
            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isAnySelectMenu()) {
            const selectmenu = interaction.client.selectmenus.get(interaction.customId.match(/[^@]+/)[0]);
            if (!selectmenu) {
                console.error(`No SelectMenu matching ${interaction.customId} was found.`);
                return;
            }
            try {
                await selectmenu.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }

        }
    },
};