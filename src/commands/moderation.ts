import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { OpenAIApi, Configuration } from 'openai';
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderation')
        .setDescription('Detects if an input is inapropriate')
        .addStringOption(option => option.setName('input').setDescription('The input to check').setRequired(true))
        .addBooleanOption(option => option.setName('verbose').setDescription('If the output should be verbose').setRequired(false))
        .addBooleanOption(option => option.setName('private').setDescription('If the output should be private').setRequired(false)),
    async execute(interaction: CommandInteraction) {
        const input = interaction.options.getString('input');
        const verbose = interaction.options.getBoolean('verbose');
        const sendprivate = interaction.options.getBoolean('private');

        const response = await openai.createModeration({
            input: input,
        });
        const data = response.data.results[0];
        for (const key in data.category_scores) {
            data.category_scores[key] = parseFloat(data.category_scores[key].toFixed(2));
        }
        const message = `The input \`${input}\` is ${data.flagged ? 'inapropriate' : 'apropriate'}`;
        if (verbose) {
            await interaction.reply(message + `\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``);
        } else {
            await interaction.reply({ content: message, ephemeral: sendprivate ? true : false });
        }
    },
};
