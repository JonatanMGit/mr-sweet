import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionsBitField } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the channel'),
    async execute(interaction) {
        // if the user has the permission to manage channels
        if (interaction.member.permissions.has('MANAGE_CHANNELS')) {
            // lock the channel
            interaction.channel.permissionOverwrites.set([
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.SendMessages],
                },
            ])

            // send a message to the channel
            await interaction.reply('Locked channel');
        }

    },
};
