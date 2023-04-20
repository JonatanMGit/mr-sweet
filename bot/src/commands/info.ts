import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { User } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get Information about something')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get information about a user')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The user to get information about')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Get information about the server')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        // respond with the following information but make sure to not expose any sensitive information
        /*
        PROPERTIES
accentColor
avatar
banner
bot
client
createdAt
createdTimestamp
defaultAvatarURL
discriminator
dmChannel
flags
hexAccentColor
id
partial
system
tag
username
        */

        if (subcommand === 'user') {
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
                    { name: 'Flags', value: flags, inline: true },
                    { name: 'Roles', value: roles, inline: true },
                    { name: 'Bot', value: `${user.bot}`, inline: true },
                    { name: 'System', value: `${user.system}`, inline: true },
                    { name: 'Partial', value: `${user.partial}`, inline: true },
                    {
                        name: 'Avatar URL', value: `[Click Here](${user.avatarURL() ? user.avatarURL() : user.defaultAvatarURL + '?size=4096'})`,
                    },
                    { name: 'Default Avatar URL', value: `[Click Here](${user.defaultAvatarURL + '?size=4096'})` },
                );


            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'server') {
            // create an embed with the server's info:
            const embed = (new EmbedBuilder() as EmbedBuilder)
                .setTitle(`${interaction.guild.name}`)
                .setDescription(`ID: ${interaction.guild.id}`)
                .setColor(0x00ff00)
                .setThumbnail(interaction.guild.iconURL())
                .addFields(
                    { name: 'Creation Date', value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Owner', value: `<@${interaction.guild.ownerId}>`, inline: true },
                    { name: 'Members', value: `${interaction.guild.memberCount}`, inline: true },
                    { name: 'Channels', value: `${interaction.guild.channels.cache.size}`, inline: true },
                    { name: 'Roles', value: `${interaction.guild.roles.cache.size}`, inline: true },
                    { name: 'Emojis', value: `${interaction.guild.emojis.cache.size}`, inline: true },
                    { name: 'Boosts', value: `${interaction.guild.premiumSubscriptionCount}`, inline: true },
                    { name: 'Boost Level', value: `${interaction.guild.premiumTier}`, inline: true },
                    { name: 'Verification Level', value: `${interaction.guild.verificationLevel}`, inline: true },
                    { name: 'Explicit Content Filter', value: `${interaction.guild.explicitContentFilter}`, inline: true },
                    { name: 'Features', value: `${interaction.guild.features.length ? interaction.guild.features.map(feature => feature.replace(/_/g, ' ').toLowerCase()).join(', ') : 'None'}`, inline: true },
                    { name: 'Rules Channel', value: `${interaction.guild.rulesChannel ? `<#${interaction.guild.rulesChannel.id}>` : 'None'}`, inline: true },
                    { name: 'Public Updates Channel', value: `${interaction.guild.publicUpdatesChannel ? `<#${interaction.guild.publicUpdatesChannel.id}>` : 'None'}`, inline: true },
                    { name: 'System Channel', value: `${interaction.guild.systemChannel ? `<#${interaction.guild.systemChannel.id}>` : 'None'}`, inline: true },
                    { name: 'Description', value: `${interaction.guild.description ? interaction.guild.description : 'None'}`, inline: true },
                    { name: 'Banner', value: `${interaction.guild.banner ? `[Click Here](${interaction.guild.bannerURL() + "?size=4096"})` : 'None'}`, inline: true },
                    { name: 'Splash', value: `${interaction.guild.splash ? `[Click Here](${interaction.guild.splashURL() + "?size=4096"})` : 'None'}`, inline: true },
                    { name: 'Discovery Splash', value: `${interaction.guild.discoverySplash ? `[Click Here](${interaction.guild.discoverySplashURL()})` : 'None'}`, inline: true },
                    { name: 'AFK Channel', value: `${interaction.guild.afkChannel ? `<#${interaction.guild.afkChannel.id}>` : 'None'}`, inline: true },
                    { name: 'AFK Timeout', value: `${interaction.guild.afkTimeout}`, inline: true },
                    { name: 'Maximum Bitrate', value: `${interaction.guild.maximumBitrate}`, inline: true },
                    { name: 'Maximum Members', value: `${interaction.guild.maximumMembers}` }
                );

            interaction.reply({ embeds: [embed] });

        }

    },
};
