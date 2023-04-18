import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified amount of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        // check perms
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            await interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
            return;
        }
        try {
            interaction.deferReply({ ephemeral: true });
            const amount = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(amount + 1, true);
            await interaction.reply(`Deleted ${amount} messages!`);
        } catch (error) {
            await interaction.reply({ content: 'There was an error while deleting the messages!', ephemeral: true });
        }
    },
};
