// Load all commands from the commands folder
import * as fs from 'fs';
import * as path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

export function loadCommands(client) {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));


    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

export function registerCommands(client) {
    //register every slash command in the commands folder
    const commandsPath = path.join(__dirname, 'commands');
    const commands = [];
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts') && file !== "about.ts");
    console.log("Starting to register commands");
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands("1043905318867980530", "813852446069751838"),
                { body: commands },
            );
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
}

// delete all global commands
export function prepareGlobalCommands(client) {
    const command = require(`./commands/about`);
    // publish this one command globally to show that the bot is invite only
    const commands = [];
    commands.push(command.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands("1043905318867980530"),
                { body: commands },
            );
            // @ts-ignore
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
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