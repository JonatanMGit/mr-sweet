import { SlashCommandBuilder } from '@discordjs/builders';
import {openai, gpt4Model, defaultSystemPrompt} from '../ai';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Ask Mr Sweet anything')
        .addStringOption(option => option.setName('input').setDescription('Your Message').setRequired(true))
        .addStringOption(option => option.setName('model').setDescription('The model to use').setRequired(false)).addChoice('gpt-4', 'gpt-4').addChoice('gpt-3.5-turbo', 'gpt-3.5-turbo'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Please wait...',
        }
        const input = interaction.options.getString('input');
        const selectedModel = interaction.options.getString('model');

        if (selectedModel === 'gpt-4') {
            model = gpt4Model;
        } else {
            model = gpt3Model;
        }

        const message = [{ role: "System", content: defaultSystemPrompt }, { role: "User", content: input }];

        const response = await openai.createChatCompletion({
            model: Model,
            prompt: defaultSystemPrompt + input,
            maxTokens: 100,
        });

        interaction.editReply({
            content: response.data.choices[0].text,
        });

    },
};
