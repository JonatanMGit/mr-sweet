import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, Message } from 'discord.js';
import { simulateText } from '../ai';
//import fs from 'fs';
import Markov from 'js-markov';
const markov = new Markov();



module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('simulate')
        .setDescription('Simulates what a user would say')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ai')
                .setDescription('Simulates what a user would say using AI')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to simulate')
                        .setRequired(true)
                )
        ).addSubcommand(subcommand =>
            subcommand
                .setName('markov')
                .setDescription('Simulates what a user would say using Markov chains')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to simulate')
                        .setRequired(true)
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');

        await interaction.reply('Fetching messages...');


        // get the last 500 messages from the user
        // repeat fetching the last 100 messages until we have 500 messages or we repeated it 10 times
        let userMessages = await interaction.channel.messages.fetch({ limit: 100, before: interaction.id });
        let lastMessageId = userMessages.lastKey();
        userMessages = userMessages.filter(message => message.author.id === user.id);
        let i = 0;
        while (userMessages.size < 200 && i < 5) {
            let moreMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId });
            lastMessageId = moreMessages.last().id;
            moreMessages = moreMessages.filter(message => message.author.id === user.id);

            userMessages = userMessages.concat(moreMessages);
            console.log(userMessages.size);
            console.log(lastMessageId);
            i++;
        }
        console.log(userMessages.size);
        console.log(lastMessageId);



        // check if there are any messages from the user
        if (userMessages.size === 0) {
            // reply with an error message ephemerally
            await interaction.editReply('There are no recent messages from this user!');
            return;
        }

        if (subcommand === 'ai') {
            // the plan is to train an RNN on the user's messages
            // then generate a message from the RNN



            // warn the user if there are less than 100 messages that it won't be very accurate
            await interaction.editReply('Training Mr Sweet...' + (userMessages.size < 100 ? '\nWarning: There are less than 100 messages from this user, so the simulation may not be very accurate.' : ''));

            // get the text from the messages
            await userMessages.reverse();
            const text = userMessages.map(message => message.content)
                // filter out empty messages
                .filter(message => message !== '')

                // filter out messages that are just links
                .filter(message => !message.startsWith('http'))
                .join('\n')

            // console.log(text);
            // save the text to a file for debugging
            // fs.writeFileSync('text.txt', text);

            // run the model from 
            const generatedText = await simulateText(text);

            console.log(generatedText);

            // reply with the generated text
            await interaction.editReply({ content: generatedText, allowedMentions: { parse: [] } });

        }

        else if (subcommand === 'markov') {
            markov.addStates(userMessages.map(message => message.content));

            markov.train();

            const generatedText = markov.generateRandom()


            await interaction.editReply({ content: generatedText, allowedMentions: { parse: [] } });
        }
    }
}