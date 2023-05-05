import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('oldest')
        .setDescription('Gets a list of the oldest users in the server'),
    async execute(interaction: ChatInputCommandInteraction) {

        await interaction.deferReply({ ephemeral: false });

        const members = await interaction.guild.members.fetch();

        const oldestMembers = members.sort((a, b) => a.user.createdAt.getTime() - b.user.createdAt.getTime()).first(20);

        const oldestMembersString = oldestMembers.map(member => `${member.displayName} - <t:${Math.floor(member.user.createdAt.getTime() / 1000)}:R>`).join('\n');

        await interaction.editReply({
            content: `The oldest members in this server are:\n${oldestMembersString}`,
            allowedMentions: { parse: [] }
        });
    },
};