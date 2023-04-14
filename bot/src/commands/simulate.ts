import { SlashCommandBuilder } from '@discordjs/builders';
const Markov = require('js-markov');
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
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        // use the user to simulate what they would say by looking at their previous messages
        // it should function the same as UserSim on reddit but for discord
        // https://github.com/trambelus/UserSim
        // use markov chains to generate the messages


        // get the last 500 messages from the user if possible
        const messages = await interaction.channel.messages.fetch({ limit: 100, before: interaction.id });
        // fetch 100 more messages if there are after the last 100
        const moreMessages = await interaction.channel.messages.fetch({ limit: 100, before: messages.last().id });
        // add the messages to the messages array
        messages.concat(moreMessages);
        // filter out the messages from the user


        const userMessages = messages.filter(message => message.author.id === user.id);

        // check if there are any messages from the user
        if (userMessages.size === 0) {
            // reply with an error message ephemerally
            await interaction.reply({ content: 'There are no recent messages from this user!', ephemeral: true });
            return;
        }

        await markov.addStates(userMessages.map(message => message.content));

        await markov.train();

        const message = await markov.generateRandom();


        // check if its a valid message and not empty
        if (message && message.length > 0) {
            // reply with the message "user said: message"
            await interaction.reply(`${user.username} would say: ${message} ` + markov.generateRandom() + ". " + markov.generateRandom());
        } else {
            // reply with an error message ephemerally
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }







    },
};
