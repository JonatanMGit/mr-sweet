import { SlashCommandBuilder } from '@discordjs/builders';
import { openai, gpt4Model, gpt3Model, defaultSystemPrompt, count_tokens, Message } from '../ai';
import { ChatCompletionRequestMessage } from 'openai';
import { RateLimiter } from 'discord.js-rate-limiter';
let rateLimiter = new RateLimiter(1, 10000);
import { getResponse } from '../ai';
import { ChatInputCommandInteraction, CommandInteraction } from 'discord.js';


module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Ask Mr Sweet anything')
        .addStringOption(option => option.setName('input').setDescription('Your Message').setRequired(true))
        .addStringOption(option => option.setName('model').setDescription('The model to use').setRequired(false).addChoices({ name: 'Mr Sweet v3', value: 'gpt-3' }, { name: 'Mr Sweet v4', value: 'gpt-4' })),
    async execute(interaction: ChatInputCommandInteraction) {
        let limited = rateLimiter.take(interaction.user.id);
        if (limited) {
            interaction.reply({
                content: "You are sending messages too fast!",
                ephemeral: true
            });
            return;
        }

        interaction.deferReply();

        const input = interaction.options.getString('input');
        const selectedModel = interaction.options.getString('model');

        let model = '';
        if (selectedModel === 'gpt-4') {
            model = gpt4Model;
        } else {
            model = gpt3Model;
        }

        const message = [{ author: interaction.user.id, content: input }] as Message[];

        const response = await getResponse(message, model);

        let data = '';

        // update the message with the new data every 1 seconds until the stream is finished
        const interval = setInterval(() => {
            interaction.editReply(data);
        }, 1000);

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
            //console.log(lines);
            for (const line of lines) {
                const message = line.replace(/^data: /, '');
                //console.log(message);
                if (message === '[DONE]') {
                    return; // Stream finished
                }
                // 'data: {"id":"chatcmpl-74zxn7a2AWCIAhAezt6fULY64RgSi","object":"chat.completion.chunk","created":1681425855,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" you"},"index":0,"finish_reason":null}]}'
                const parsed = JSON.parse(message);
                if (parsed.choices && parsed.choices[0].delta.content !== undefined) {
                    // fix bug where the data is undefined
                    data += parsed.choices[0].delta.content;
                }
            }
        });
        // stop the interval when the stream is finished, but mak
        response.data.on('end', () => {
            clearInterval(interval);
            interaction.editReply(data);
            message.push({ "author": "assistant", "content": data });
            count_tokens(message, interaction.user.id, model);
        });
    },
};
