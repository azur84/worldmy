require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
process.env.basepath = __dirname

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.buttons = new Collection();
const buttonsfoldersPath = path.join(__dirname, 'buttons');
const buttonsFolders = fs.readdirSync(buttonsfoldersPath);

for (const folder of buttonsFolders) {
    const buttonsPath = path.join(buttonsfoldersPath, folder);
    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
    for (const file of buttonFiles) {
        const filePath = path.join(buttonsPath, file);
        const button = require(filePath);
        if ('data' in button && 'execute' in button) {
            client.buttons.set(button.data?.data?.custom_id || button.id, button);
        } else {
            console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.selectmenus = new Collection();
const selectmenusfoldersPath = path.join(__dirname, 'selectmenus');
const selectmenusFolders = fs.readdirSync(selectmenusfoldersPath);

for (const folder of selectmenusFolders) {
    const selectmenusPath = path.join(selectmenusfoldersPath, folder);
    const selectmenuFiles = fs.readdirSync(selectmenusPath).filter(file => file.endsWith('.js'));
    for (const file of selectmenuFiles) {
        const filePath = path.join(selectmenusPath, file);
        const selectmenu = require(filePath);
        if ('id' in selectmenu && 'execute' in selectmenu) {
            client.selectmenus.set(selectmenu.id, selectmenu);
        } else {
            console.log(`[WARNING] The selectmenu at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.select = new Collection()

console.log(`app login with token : "${process.env.TOKEN}"`)
client.login(process.env.TOKEN);