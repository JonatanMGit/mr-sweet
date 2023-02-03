import { SlashCommandBuilder } from '@discordjs/builders';
//import bad-words npm package
var Filter = require('bad-words'),
    filter = new Filter();

import { OpenAIApi, Configuration } from 'openai';
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderation')
        .setDescription('Detects if an input is inappropriate')
        .addSubcommand(subcommand => subcommand
            .setName('ai')
            .setDescription('Detects if an input is inappropriate using AI')
            .addStringOption(option => option.setName('input').setDescription('The input to check').setRequired(true))
            .addBooleanOption(option => option.setName('verbose').setDescription('If the output should be verbose').setRequired(false))
            .addBooleanOption(option => option.setName('private').setDescription('If the output should be private').setRequired(false))
        )
        .addSubcommand(subcommand => subcommand
            .setName('wordlist')
            .setDescription('Detects if an input is inappropriate using a wordlist')
            .addStringOption(option => option.setName('input').setDescription('The input to check').setRequired(true))
            .addBooleanOption(option => option.setName('private').setDescription('If the output should be private').setRequired(false))
        ),

    async execute(interaction) {
        const input = interaction.options.getString('input');
        const verbose = interaction.options.getBoolean('verbose');
        let sendprivate = interaction.options.getBoolean('private');
        if (sendprivate === null) {
            sendprivate = false;
        }

        const command = interaction.options.getSubcommand();

        if (command === 'ai') {

            const response = await openai.createModeration({
                input: input,
            });
            const data = response.data.results[0];
            for (const key in data.category_scores) {
                data.category_scores[key] = parseFloat(data.category_scores[key].toFixed(2));
            }
            const message = `The input \`${input}\` is ${data.flagged ? 'inappropriate' : 'appropriate'}`;
            if (verbose) {
                await interaction.reply(message + `\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``);
            } else {
                await interaction.reply({ content: message, ephemeral: sendprivate });
            }

        } else if (command === 'wordlist') {
            const message = `The input \`${input}\` is ${filter.isProfane(input) ? 'inappropriate' : 'appropriate'}`;
            await interaction.reply({ content: message, ephemeral: sendprivate });
        }
    },
};
