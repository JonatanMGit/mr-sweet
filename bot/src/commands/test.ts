import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import createWelcomeGif from '../image';


module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('fnaf')
        .setDescription('sends a test welcome message'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        /*
        createWelcomeGif(interaction.user).then((buffer) => {
            interaction.editReply({
                files: [{
                    attachment: buffer,
                    name: "welcome.gif"
                }]
            });
        }
        );
        */

        const join = require('../events/join');
        join.execute(interaction.member);
    },
};
