import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, User } from 'discord.js';

module.exports = {
    global: true,
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
        const user = interaction.options.getUser('user') as GuildMember;
        const reason = interaction.options.getString('reason');
        if (user) {
            // chck permissions and if user is bannable 
            if (interaction.member.permissions.has('BAN_MEMBERS') && user.bannable) {
                // send dm to user
                let message = `You have been banned from ${interaction.guild.name}`;
                if (reason) {
                    message += ` for ${reason}`;
                }
                await user.send(message);
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
