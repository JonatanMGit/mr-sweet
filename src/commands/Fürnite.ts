import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scary')
        .setDescription('Replies with your input!'),
    async execute(interaction) {
        // await interaction.reply('fart');
        // await interaction.editReply('fart noise');
        await interaction.reply('Here is an image');
        // add a follow up message
        await interaction.followUp('https://tr.rbxcdn.com/cf42c1b0deb049eecc8d8fe2a73efe9c/768/432/Image/Png');
    }
}

