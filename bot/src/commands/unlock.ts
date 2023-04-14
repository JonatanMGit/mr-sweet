import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionsBitField } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the channel'),
    async execute(interaction) {
        // if the user has the permission to manage channels
        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            // lock the channel
            // fix RangeError [BitFieldInvalid]: Invalid bitfield flag or number: SEND_MESSAGES.
            interaction.channel.permissionOverwrites.set([
                {
                    id: interaction.guild.roles.everyone,
                    allow: [PermissionsBitField.Flags.SendMessages],
                },
            ])

            // send a message to the channel
            await interaction.reply('Unlocked channel');
        }

    },
};