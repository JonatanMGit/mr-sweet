import { Client, GatewayIntentBits, Events, Collection, DiscordAPIError } from 'discord.js';
require('dotenv').config();
import { prepareGlobalCommands, loadCommands, registerCommands } from './commandUtils';
import handleEvents from './eventHandler';
import { printInvites, updateInvite } from './invites';

export interface CustomClient extends Client {
    commands: Collection<string, any>
}
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.GuildMessages, GatewayIntentBits.AutoModerationConfiguration] }) as CustomClient;
export default client;
client.commands = new Collection();


// reload commands
handleEvents(client);

loadCommands(client);
prepareGlobalCommands(client);



// Notify when the bot is ready
client.once(Events.ClientReady, () => {
    console.log('Ready!');

    updateInvite(client);
});

(async () => {
    await client.login(process.env.TOKEN);
    registerCommands(client);
})();

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

