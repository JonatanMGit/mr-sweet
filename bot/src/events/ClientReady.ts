import { ActivityType, Events } from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        client.user?.setPresence({
            activities: [
                {
                    name: 'you',
                    type: ActivityType.Watching,
                },
            ],
            status: 'online',
        });

        client.guilds.cache.forEach((guild) => {
            console.log(guild.name + " - " + guild.id);
        }
        );
    }
};