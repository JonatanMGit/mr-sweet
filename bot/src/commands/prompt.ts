import { SlashCommandBuilder } from '@discordjs/builders';
import { openai, gpt4Model, gpt3Model, defaultSystemPrompt } from '../ai';
import { ChatCompletionRequestMessage } from 'openai';
import { RateLimiter } from 'discord.js-rate-limiter';
let rateLimiter = new RateLimiter(1, 10000);


module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Ask Mr Sweet anything')
        .addStringOption(option => option.setName('input').setDescription('Your Message').setRequired(true))
        .addStringOption(option => option.setName('model').setDescription('The model to use').setRequired(false).addChoices({ name: 'Mr Sweet v3', value: 'gpt-3' }, { name: 'Mr Sweet v4', value: 'gpt-4' })),
    async execute(interaction) {
        let limited = rateLimiter.take(interaction.user.id);
        if (limited) {
            interaction.reply({
                content: "You are sending messages too fast!",
                ephemeral: true
            });
            return;
        }
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
