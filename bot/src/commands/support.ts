import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('MrSweet\'s Discord server.'),
    async execute(interaction) {
        await interaction.reply({
            content: 'https://discord.gg/jE66NtBZZe', ephemeral: true
        });
    },
};
