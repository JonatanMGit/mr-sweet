import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, Message } from 'discord.js';
import Markov from 'js-markov';
var markov = new Markov();
module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('simulate')
        .setDescription('simulates what a user would say')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to simulate')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user');

        interaction.reply('Fetching messages...');

        // use the user to simulate what they would say by looking at their previous messages
        // it should function the same as UserSim on reddit but for discord
        // https://github.com/trambelus/UserSim
        // use markov chains to generate the messages


        // get the last 500 messages from the user
        // repeat fetching the last 100 messages until we have 500 messages or we repeated it 10 times
        let userMessages = await interaction.channel.messages.fetch({ limit: 100, before: interaction.id });
        let lastMessageId = userMessages.lastKey();
        userMessages = userMessages.filter(message => message.author.id === user.id);
        let i = 0;
        while (userMessages.size < 200 && i < 10) {
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

        interaction.editReply('Training Mr Sweet...');

        // check if there are any messages from the user
        if (userMessages.size === 0) {
            // reply with an error message ephemerally
            await interaction.editReply('There are no recent messages from this user!');
            return;
        }

        await markov.addStates(userMessages.map(message => message.content));

        await markov.train();

        const message = await markov.generateRandom();


        // check if its a valid message and not empty
        if (message && message.length > 0) {
            // read the length of the content
            let contentLength = 0;
            userMessages.forEach(message => {
                contentLength += message.content.length;
            });
            // reply with the message "user said: message"
            const repMessage = `${user.username} would say: ${message}\n${userMessages.size} messages were used to generate this message with an average message length of ${(contentLength / userMessages.size).toFixed(0)} characters taken from the last ${i * 100} messages.`;


            await interaction.editReply({ content: repMessage, allowedMentions: { users: [] } });
        } else {
            // reply with an error message ephemerally
            await interaction.editReply({
                content: `No Messages were found! ${message.length}`
            });
        }
    },
};
