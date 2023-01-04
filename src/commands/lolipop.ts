import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolipop')
        .setDescription('cool'),
    async execute(interaction) {
        // await interaction.reply('fart');
        // await interaction.editReply('fart noise');
        await interaction.reply('Here is an image');
        // add a follow up message
        await interaction.followUp('https://i1.sndcdn.com/artworks-FBNUtixUjOTiGdE1-kUbEiA-t500x500.jpg');
    }
}

