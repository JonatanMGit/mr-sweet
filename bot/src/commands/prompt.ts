import { SlashCommandBuilder } from '@discordjs/builders';
import { openai, gpt4Model, gpt3Model, defaultSystemPrompt } from '../ai';
import { ChatCompletionRequestMessage } from 'openai';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Ask Mr Sweet anything')
        .addStringOption(option => option.setName('input').setDescription('Your Message').setRequired(true))
        .addStringOption(option => option.setName('model').setDescription('The model to use').setRequired(false)),
    async execute(interaction) {
        await interaction.reply("Thinking...")
        const input = interaction.options.getString('input');
        const selectedModel = interaction.options.getString('model');

        let model = '';
        if (selectedModel === 'gpt-4') {
            model = gpt4Model;
        } else {
            model = gpt3Model;
        }

        const message = [{ role: "system", content: defaultSystemPrompt }, { role: "user", content: input }] as ChatCompletionRequestMessage[];

        const response = await openai.createChatCompletion({
            model: model,
            messages: message,
            max_tokens: 500,
        });

        await interaction.editReply(response.data.choices[0].message);
    },
};
