import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, GuildMember, User, PermissionsBitField } from 'discord.js';
import client from '..';


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
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user') as User;
        const reason = interaction.options.getString('reason') as string;

        await interaction.deferReply({ ephemeral: true });

        // get member from user
        const member = interaction.guild.members.cache.get(user.id) as GuildMember;


        if (member) {
            // check permissions and if user is bannable 
            if ((interaction.member.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.BanMembers)) {
                // check if the bots role is higher than the users role
                if (interaction.guild.members.cache.get(client.user.id).roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                    await interaction.editReply({ content: 'I do not have permission to ban this user' });
                    return;
                }

                try {
                    // send dm to user
                    let message = `You have been banned from ${interaction.guild.name}`;
                    if (reason) {
                        message += ` for "${reason}"`;
                    }
                    await member.send(message);
                } catch {
                    await interaction.editReply({ content: 'Could not send dm to user' });
                }
                // ban user
                try {
                    await interaction.guild.members.ban(member, { reason: reason });
                    await interaction.editReply(`Banned ${member}`);
                } catch {
                    await interaction.editReply(`Could not ban ${member}`);
                }
            } else {
                await interaction.editReply({ content: 'You do not have permission to ban members' });
            }
        } else {
            await interaction.editReply({ content: 'You did not provide a user to ban' });
        }
    },
};
