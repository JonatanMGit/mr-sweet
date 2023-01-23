import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fart')
        .setDescription('Fart!'),
    async execute(interaction) {
        //'fart noise when when say fart
        await interaction.reply('fart');
        // edit the message to say 'fart noise'
        await interaction.editReply('fart noise');
        // say person say fart for bot to say fart


    },
};
