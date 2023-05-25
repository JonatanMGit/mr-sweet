// Load all commands from the commands folder
import * as fs from 'fs';
import * as path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { CustomClient } from './index';

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

export async function loadCommands(client: CustomClient) {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command && 'global' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

export async function registerCommands(client: CustomClient) {
    //register every slash command in the commands folder if command.global is false
    const commands = [];
    // check if the bots id is 1043905318867980530 in order to prevent registering commands in the wrong bot
    if (client.user.id !== "1043905318867980530") {
        console.error("Wrong bot id");
        return;
    }
    console.log("Starting to register commands");
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        if (command.data.toJSON().name !== "eval" && process.env.NODE_ENV === "production") {
            continue;
        }

        if (command.global === false) {

            commands.push(command.data.toJSON());
        }
    }

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} SWT application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands("1043905318867980530", "813852446069751838"),
                { body: commands },
            );
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} SWT application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
}

// delete all global commands
export async function prepareGlobalCommands(client: CustomClient) {
    //register every glboal slash command in the commands folder if command.global is true
    const commands = [];
    console.log("Starting to register commands");
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        if (command.global === true) {
            commands.push(command.data.toJSON());
        }
    }


    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} global application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(process.env.clientId),
                { body: commands },
            );
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    }
    )();


}
module.exports = {
    loadCommands,
    registerCommands,
    prepareGlobalCommands
};