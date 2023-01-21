import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        // reply with the input but dont show who said it
        await interaction.channel.send(input, { allowedMentions: {} });
        // finish the interaction
        await interaction.reply({ content: 'Sent!', ephemeral: true });
    },
};