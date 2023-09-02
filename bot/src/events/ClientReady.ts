import { ActivitiesOptions, ActivityType, Events } from 'discord.js';
import { CustomClient } from '..';


async function getShardString(client: CustomClient): Promise<string> {
    if (client.shard) {
        // return a string like "1/2"
        return `${client.shard.ids[0] + 1}/${client.shard.count}`;
    }
    else {
        return "1/1";
    }
}

module.exports = {
    name: Events.ClientReady,
    async execute(client: CustomClient) {

        const activities: ActivitiesOptions[] = [
            {
                name: 'you',
                type: ActivityType.Watching
            },
            {
                name: `over ${client.guilds.cache.size} servers`,
                type: ActivityType.Watching,
            },
            {
                name: `the Shard ${await getShardString(client)}`,
                type: ActivityType.Watching,
            }
        ];

        let index = 0;

        setInterval(() => {
            client.user?.setPresence({
                activities: [activities[index]],
                status: 'online',
            });

            index = (index + 1) % activities.length;
        }, 60000);

        let total = 0;
        client.guilds.cache.forEach((guild) => {
            console.log(guild.name + " - " + guild.id);
            // get member count of guild
            total += guild.memberCount;
        });
        console.log("Total members: " + total);
    }

}
//
