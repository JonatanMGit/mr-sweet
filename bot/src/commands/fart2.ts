import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fart2')
        .setDescription('Replies with your input!'),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        await interaction.reply("der farts a lot and it smells");
    },
};
