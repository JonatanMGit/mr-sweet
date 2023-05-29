import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, MessageCreateOptions } from 'discord.js';

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
                .setRequired(false))
        // the message to reply to
        .addStringOption(option =>
            option.setName('reply')
                .setDescription('The message id to reply to')
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input');
        const attachment = interaction.options.getAttachment('attachment');
        const reply = interaction.options.getString('reply');
        let message = { allowedMentions: {} } as MessageCreateOptions;
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
            // check if the message is more than 2000 characters
            if (input.length > 2000) {
                await interaction.reply({ content: 'Your message is too long!', ephemeral: true });
                return;
            }

            message.content = input;

        }
        if (attachment) {
            message.files = [attachment];
        }

        if (reply) {
            message.reply = {
                messageReference: reply
            }
        }

        // detect if the message is empty
        if (!message.content && !message.files) {
            await interaction.reply({ content: 'You must provide some input!', ephemeral: true });
            return;
        }

        await interaction.channel.send(message)

        // finish the interaction
        await interaction.deleteReply();
    },
};
