import { SlashCommandBuilder } from '@discordjs/builders';
import { saveGuild } from '../db';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshguilds')
        .setDescription('Refreshes saved guilds!')
        .addBooleanOption(option =>
            option.setName('all')
                .setDescription('Refresh all guilds')
                .setRequired(false)),
    async execute(interaction) {
        // check if the user has the id of the owner of the bot
        if (interaction.user.id !==
            interaction.client.application.owner.id) {
            await interaction.reply('You are not the owner of the bot!');
            return;
        }
        const all = interaction.options.getBoolean('all');
        if (all) {
            // get all guilds from client
            const guilds = interaction.client.guilds.cache;
            // save all guilds
            guilds.forEach(async (guild) => {
                await saveGuild(guild.id);
            }
            );
            await interaction.reply('Refreshed all guilds!');
        } else {
            // get guild from interaction
            const guild = interaction.guild;
            // save guild
            await saveGuild(guild.id);
            await interaction.reply('Refreshed guild!');
        }
    },
};
