import { Client, GatewayIntentBits, Events, Collection, DiscordAPIError } from 'discord.js';
require('dotenv').config();
import { prepareGlobalCommands, loadCommands, registerCommands } from './commandUtils';
import handleEvents from './eventHandler';

export interface CustomClient extends Client {
    commands: Collection<string, any>
}
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.GuildMessages] }) as CustomClient;
export default client;
client.commands = new Collection();

// make it async so that the bot can already start while the commands are being registered
(async () => {

    // reload commands
    registerCommands(client);
    loadCommands(client);
    prepareGlobalCommands(client);
    handleEvents(client);

})();

// Notify when the bot is ready
client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.login(process.env.TOKEN);

process.on('uncaughtException', (err) => {
    if (err instanceof DiscordAPIError) {
        if (err.code == 10062) {
            console.error("Missing permissions to execute command");
        } else if (err.code == 40060) {
            console.error("Interaction failed");
        }
        console.error(err);
    } else {
        console.error(err);
        process.exit(1);
    }
});

