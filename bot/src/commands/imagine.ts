import { SlashCommandBuilder } from '@discordjs/builders';
import { openai, localOpenai } from '../ai'
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

if (process.env.LOCAL_GPT === 'true') {
    data.addStringOption(option => option.setName('model').setDescription('The model to use').setRequired(false).addChoices({ name: 'Mr Sweet Local', value: 'local' }, { name: 'OpenAI', value: 'openai' }));
}

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

        // limit the amount of images to 5
        if (amount > 10) {
            await interaction.editReply('You can only generate 10 images at a time');
            return;
        }

        const request = {
            prompt: prompt,
            n: amount,
            response_format: 'url',
            size: size

        } as CreateImageRequest

        let responder = openai;
        if (process.env.LOCAL_GPT === 'true' && interaction.options.getString('model') !== 'openai') {
            responder = localOpenai;
        }

        let files = [];

        try {
            const response = await responder.createImage(
                request
            );


            for (const image of response.data.data) {
                files.push({
                    attachment: image.url,
                    name: "image.png"
                });
            }
        }
        catch (e) {
            console.log(e);
            await interaction.editReply('Something went wrong');
            return;

        }
        await interaction.editReply({ files: files });
    },
};
