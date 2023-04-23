import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('swt')
        .setDescription('MrSweet discord server'),
    async execute(interaction) {
        await interaction.reply({
            content: 'discord.gg/jE66NtBZZe', ephemeral: true
        });
    },
};
