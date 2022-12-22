const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

require('dotenv').config();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(process.env.TOKEN);

