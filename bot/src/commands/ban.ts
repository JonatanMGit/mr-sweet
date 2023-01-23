import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false))
        .setDescription('Bans a user'),
        async execute(interaction) {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            if (user) {
                // chck perms
                if (interaction.member.permissions.has('BAN_MEMBERS')) {
                    // ban user
                    await interaction.guild.members.ban(user, { reason: reason });
                    await interaction.reply(`Banned ${user}`);
                } else {
                    await interaction.reply({ content: 'You do not have permission to ban members', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'You did not provide a user to ban', ephemeral: true });
            }
    },
};
