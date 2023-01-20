import { Events } from 'discord.js';

module.exports = {
    // send a message to the channel 1051064356026187846 when a user leaves
    // the time is an unix timestamp so like <t:1620000000:R>
    name: Events.GuildMemberRemove,
    async execute(event) {
        console.log(`User ${event.user.tag} left the guild.`);
        let channel = event.guild.channels.cache.get('1051064356026187846');
        // if channel not if cache, fetch it
        if (!channel) {
            const fetchedChannel = await event.guild.channels.fetch('1051064356026187846');
            if (!fetchedChannel) {
                console.log('Channel not found');
                return;
            }
            channel = fetchedChannel;
        }
        // send the message

        const message = `User ${event.user.tag} left the guild (${event.guild.name})) with the following data:
\`\`\`json\n${JSON.stringify(event.user, null, 4)}\`\`\`Time: <t:${Math.floor(Date.now() / 1000)}:R>`;

        await channel.send(message);
    }
};

