import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, MessageCreateOptions } from 'discord.js';
import { saveSaid } from '../db';
import { IGNORED_IDs } from "..";

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
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('hidden')
                .setDescription('Whether you should be publicly credited for the message using the author command')
                .setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input');
        const attachment = interaction.options.getAttachment('attachment');
        const reply = interaction.options.getString('reply');
        let message = { allowedMentions: {} } as MessageCreateOptions;
        // defer reply to allow for file upload if it takes longer than 3 seconds
        await interaction.deferReply({ ephemeral: true });

        let ishidden = interaction.options.getBoolean('hidden')
        // invert the hidden selection if the user is authorized (IGNORED_IDs)
        if (IGNORED_IDs.includes(interaction.user.id)) {
            ishidden = !ishidden;
        }


        // check if message begins with Author: abd then deny it
        if (input && input.includes('Author:')) {
            interaction.editReply("Acces denied as you are trying to impersonate someone!");
            return;
        }
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
                await interaction.editReply({ content: 'Your message is too long!' });
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
            await interaction.editReply({ content: 'You must provide some input!' });
            return;
        }

        // send the message while disabling mentions
        const sentMessage = await interaction.channel.send({ ...message, allowedMentions: { parse: [] } });

        // save the message to the database
        await saveSaid(sentMessage, interaction.user, ishidden);

        // finish the interaction
        await interaction.deleteReply();
    },
};
