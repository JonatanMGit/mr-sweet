import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(false))
        .addAttachmentOption(option =>
            option.setName('attachment')
                .setDescription('The attachment to send')
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input');
        const attachment = interaction.options.getAttachment('attachment');
        let message = { allowedMentions: {} };
        // defer reply to allow for file upload if it takes longer than 3 seconds
        await interaction.deferReply({ ephemeral: true });
        /*
        if (attachment && interaction.author.id !== '1') {
            await interaction.reply({ content: 'This feature is reserved for Mr Sweet pro users only!', ephemeral: true });
            return;
        }
        */
        // add each option to the message inidividually and allow one to be missing
        if (input) {
            message['content'] = input;
        }
        if (attachment) {
            message['files'] = [attachment];
        }
        await interaction.channel.send(message);

        // finish the interaction
        await interaction.deleteReply();
    },
};
