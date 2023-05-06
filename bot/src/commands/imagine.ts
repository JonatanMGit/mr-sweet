import { SlashCommandBuilder } from '@discordjs/builders';
import { openai } from '../ai'
import { CreateImageRequest, CreateImageRequestSizeEnum } from 'openai';
import { APIApplicationCommandOptionChoice, ChatInputCommandInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
let rateLimiter = new RateLimiter(1, 10000);

let choises = [];

// fill out choises for every enum in CreateImageRequestSizeEnum
for (let size in CreateImageRequestSizeEnum) {
    // strip the _
    size = size.replace('_', '');
    const choice: APIApplicationCommandOptionChoice<string> = {
        name: size,
        value: size
    }
    choises.push(choice);
}
const data = new SlashCommandBuilder()
    .setName('imagine')
    .setDescription('Image a new image using Mr Sweet')
    .addStringOption(option =>
        option.setName('prompt')
            .setDescription('The prompt to use')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('amount')
            .setDescription('The amount of images to generate')
            .setRequired(false)
            .setMaxValue(10)
            .setMinValue(1))
    .addStringOption(option => {
        option.setName('size')
            .setDescription('The size of the image')
            .setRequired(false)

        // repeatedly add every choice to the option
        for (const choice of choises) {
            const cur_choice = {
                "name": choice.name, "value": choice.value
            }
            // console.log(cur_choice)
            option.addChoices(cur_choice)
        }
        return option;
    });



module.exports = {
    global: true,
    premium: true,
    data: data,
    async execute(interaction: ChatInputCommandInteraction) {
        let limited = rateLimiter.take(interaction.user.id);
        if (limited) {
            interaction.reply({
                content: "You are sending messages too fast!",
                ephemeral: true
            });
            return;
        }
        await interaction.deferReply();

        const prompt = interaction.options.getString('prompt');
        const amount = interaction.options.getInteger('amount') || 1;
        const size = interaction.options.getString('size') || '256x256';

        const request = {
            prompt: prompt,
            n: amount,
            response_format: 'url',
            size: size

        } as CreateImageRequest
        let message = '';
        try {
            const response = await openai.createImage(
                request
            );


            for (const image of response.data.data) {
                message += image.url + '\n';
            }
        }
        catch (e) {
            message = e.response.data.error.message;

        }


        await interaction.editReply(message);


    },
};
