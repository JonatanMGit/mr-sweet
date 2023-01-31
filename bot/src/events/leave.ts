import { Events, TextChannel } from 'discord.js';
import client from '../index';

module.exports = {
    // send a message to the channel 1051064356026187846 when a user leaves
    // the time is an unix timestamp so like <t:1620000000:R>
    name: Events.GuildMemberRemove,
    async execute(event) {
        console.log(`User ${event.user.tag} left the guild (${event.guild.name}) with the following data:`);
        const guild = client.guilds.cache.get('813852446069751838');
        let channel = guild.channels.cache.get('1051064356026187846') as TextChannel;
        // if channel not if cache, fetch it
        if (!channel) {
            const fetchedChannel = await guild.channels.fetch('1051064356026187846') as TextChannel;
            if (!fetchedChannel) {
                console.log('Channel not found');
                return;
            }
            channel = fetchedChannel;
        }
        // send the message

        const message = `User ${event.user.tag} left the guild (${event.guild.name}) with the following data:
\`\`\`json\n${JSON.stringify(event.user, null, 4)}\`\`\`Time: <t:${Math.floor(Date.now() / 1000)}:R>`;

        await channel.send(message);
    }
};

