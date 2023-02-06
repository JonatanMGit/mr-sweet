import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cheesecake')
        .setDescription('poop'),
    async execute(interaction) {

        const guild = interaction.client.guilds.cache.get('813852446069751838');
        setInterval(() => {
            const membercount = guild.memberCount;
            const channel = guild.channels.cache.get('1055963908520824922');
            channel.setName(`Total Members: ${membercount.toLocaleString()}`);
        }, 5000);


    },
}