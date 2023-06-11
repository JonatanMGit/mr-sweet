import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { getImagesFromPost } from '../redditHandler';
import { tr } from '@faker-js/faker';


module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Send a galery of images from a reddit post')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Your url')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const data = await getImagesFromPost(interaction.options.getString('url')!)

        if (data) {
            //create file attachment for each image
            let files = [];
            for (const image of data) {
                files.push({
                    attachment: image,
                });

                console.log(image);

            }

            //send images using interaction.channel.send, but if there are more than 10 images, send them in batches of 10
            let i = 0;
            while (i < files.length) {
                if (i + 10 < files.length) {
                    await interaction.channel.send({ files: files.slice(i, i + 10) });
                }
                else {
                    await interaction.channel.send({ files: files.slice(i, files.length) });
                }
                i += 10;
            }

            interaction.deleteReply();
        }
        else {
            interaction.editReply("Invalid URL");
        }
    },
};
