import { Events } from 'discord.js';

module.exports = {
    // send a message to the channel 1051064356026187846 when a user leaves
    // the time is an unix timestamp so like <t:1620000000:R>
    name: Events.GuildMemberRemove,
    async execute(event) {
        console.log(`User ${event.user.tag} left the guild.`);
        const channel = event.guild.channels.cache.get('1051064356026187846');

        const message = `User ${event.user.tag} left the guild with the following data:
\`\`\`json\n${JSON.stringify(event.user, null, 4)}\`\`\`Time: <t:${Math.floor(Date.now() / 1000)}:R>`;

        await channel.send(message);
    }
};

