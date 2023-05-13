import { SlashCommandBuilder } from '@discordjs/builders';
import { gpt4Model, gpt3Model, count_tokens, Message } from '../ai';
import { RateLimiter } from 'discord.js-rate-limiter';
let rateLimiter = new RateLimiter(1, 10000);
import { getResponse, messagesToChatCompletionRequestMessage } from '../ai';
import { ChatInputCommandInteraction, Message as DiscordMessage } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Ask Mr Sweet anything')
        .addStringOption(option => option.setName('input').setDescription('Your Message').setRequired(true))
        .addStringOption(option => option.setName('model').setDescription('The model to use').setRequired(false).addChoices({ name: 'Mr Sweet v3', value: 'gpt-3' }, { name: 'Mr Sweet v4', value: 'gpt-4' })
        ).addBooleanOption(option => option.setName('hidden').setDescription("Don't show the author of the message").setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        let limited = rateLimiter.take(interaction.user.id);
        if (limited) {
            interaction.reply({
                content: "You are sending messages too fast!",
                ephemeral: true
            });
            return;
        }


        const input = interaction.options.getString('input');
        const selectedModel = interaction.options.getString('model');
        let hidden = interaction.options.getBoolean('hidden');
        hidden = !hidden;

        await interaction.deferReply();

        let model = '';
        if (selectedModel === 'gpt-3') {
            model = gpt3Model;
        } else {
            model = gpt4Model;
        }

        const message = [{ author: interaction.user.id, content: input }] as Message[];

        const response = await getResponse(message, model);

        let data = '';


        let sweetMessage: DiscordMessage;

        if (!hidden) {
            await interaction.deleteReply();
            sweetMessage = await interaction.channel.send("Thinking...");
        }



        // update the message with the new data every 1 seconds until the stream is finished
        const interval = setInterval(() => {
            if (hidden) {
                interaction.editReply(data);
            } else {
                sweetMessage.edit(data);
            }
        }, 1000);

        response.data.on('data', (chunk: Buffer) => {
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
            if (hidden) {
                interaction.editReply(data);
            } else {
                sweetMessage.edit(data);
            }
            // push the response to the message array to also count the tokens for the response
            message.push({ author: '1043905318867980530', content: data });
            console.log(messagesToChatCompletionRequestMessage(message));
            count_tokens(messagesToChatCompletionRequestMessage(message), interaction.user.id, model);
        });
    },
};