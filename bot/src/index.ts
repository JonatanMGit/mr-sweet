const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });
require('dotenv').config();
import * as fs from 'fs';
const path = require('node:path');
import { loadCommands, registerCommands } from './commandUtils';


client.commands = new Collection();

// make it async so that the bot can already start while the commands are being registered
(async () => {

    // reload commands
    registerCommands(client);
    loadCommands(client);


})();
// Handle events

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

// Set up the bot
client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.login(process.env.TOKEN);
//ooggagaga
