import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, GuildMember, User } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Information about the user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user\'s info you want to see')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') as User;
        // create an embed with the user's info:
        // username, discriminator, id, avatar url, creation date, flags (badges/bot) , roles
        const roles = interaction.guild.members.cache.get(user.id).roles.cache.map(role => role.toString()).join(' ');

        // format the flags into a string so that it can be displayed in the embed
        const flags = user.flags.toArray().length ? user.flags.toArray().map(flag => flag.replace(/_/g, ' ').toLowerCase()).join(', ') : 'None';

        // detect if the user hasn't set an avatar and then set the avatar url to the default avatar url instead
        const avatarURL = user.avatarURL() ? user.avatarURL() : user.defaultAvatarURL;

        const embed = (new EmbedBuilder() as EmbedBuilder)
            .setTitle(`${user.username}#${user.discriminator}`)
            .setDescription(`ID: ${user.id}`)
            .setColor(0x00ff00)
            .setThumbnail(avatarURL)
            .addFields(
                { name: 'Creation Date', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
                { name: 'Flags', value: flags },
                { name: 'Roles', value: roles },
            );


        await interaction.reply({ embeds: [embed] });
    },
};