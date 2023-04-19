import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flips a coin'),
    async execute(interaction) {
        const coin = Math.floor(Math.random() * 2);
        if (coin === 0) {
            await interaction.reply("Heads!");
        } else {
            await interaction.reply("Tails!");
        }
    },
};
