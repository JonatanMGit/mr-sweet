import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified amount of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of messages to delete')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction: ChatInputCommandInteraction) {
        // check perms
        if (!(interaction.member.permissions as PermissionsBitField).has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
            return;
        }
        try {
            interaction.deferReply({ ephemeral: true });
            const amount = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(amount, true);
            await interaction.editReply(`Deleted ${amount} messages!`);
        } catch (error) {
            await interaction.editReply('There was an error while deleting the messages!');
        }
    },
};
