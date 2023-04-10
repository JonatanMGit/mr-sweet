import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
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
            const user = interaction.options.getUser('target');
            const message = `Username: ${user.username}
            \nID: ${user.id}
            \nDiscriminator: ${user.discriminator}
            \nCreated at: ${user.createdAt}
            \nBot: ${user.bot}
            \nSystem: ${user.system}
            \nFlags: ${user.flags}
            \nAvatar: ${user.avatar}
            \nDefault avatar: ${user.defaultAvatarURL}
            \nHex accent color: ${user.hexAccentColor}
            \nAccent color: ${user.accentColor}
            \nBanner: ${user.banner}
            \nDM channel: ${user.dmChannel}
            \nPartial: ${user.partial}
            \nCreated at timestamp: ${user.createdTimestamp}`;
            await interaction.reply(message, {allowedMentions: {parse: []}});
        } else if (subcommand === 'server') {   
            const message = `Name: ${interaction.guild.name}
            \nID: ${interaction.guild.id}
            \nOwner: ${interaction.guild.owner}
            \nCreated at: ${interaction.guild.createdAt}
            \nCreated at timestamp: ${interaction.guild.createdTimestamp}
            \nRegion: ${interaction.guild.region}
            \nMember count: ${interaction.guild.memberCount}
            \nMax members: ${interaction.guild.maximumMembers}
            \nMax presences: ${interaction.guild.maximumPresences}
            \nMax video channel users: ${interaction.guild.maximumVideoChannelUsers}
            \nPreferred locale: ${interaction.guild.preferredLocale}
            \nVerification level: ${interaction.guild.verificationLevel}
            \nDescription: ${interaction.guild.description}
            \nFeatures: ${interaction.guild.features}
            \nSplash: ${interaction.guild.splash}
            \nDiscovery splash: ${interaction.guild.discoverySplash}
            \nBanner: ${interaction.guild.banner}
            \nRules channel: ${interaction.guild.rulesChannel}
            \nPublic updates channel: ${interaction.guild.publicUpdatesChannel}
            \nVanity url code: ${interaction.guild.vanityURLCode}
            \nVanity url uses: ${interaction.guild.vanityURLUses}
            \nPartnered: ${interaction.guild.partnered}
            \nVerified: ${interaction.guild.verified}
            \nNSFW level: ${interaction.guild.nsfwLevel}
            \nOwner ID: ${interaction.guild.ownerId}
            \nSystem channel flags: ${interaction.guild.systemChannelFlags}
            \nSystem channel: ${interaction.guild.systemChannel}
            \nWidget enabled: ${interaction.guild.widgetEnabled}
            \nWidget channel: ${interaction.guild.widgetChannel}
            \nMax video channel users: ${interaction.guild.maximumVideoChannelUsers}
            \nApplication ID: ${interaction.guild.applicationId}
            \nAFK channel: ${interaction.guild.afkChannel}
            \nAFK channel ID: ${interaction.guild.afkChannelId}
            \nAFK timeout: ${interaction.guild.afkTimeout}
            \nDefault message notifications: ${interaction.guild.defaultMessageNotifications}
            \nExplicit content filter: ${interaction.guild.explicitContentFilter}
            \nMFA level: ${interaction.guild.mfaLevel}
            \nPremium subscription count: ${interaction.guild.premiumSubscriptionCount}
            \nPremium tier: ${interaction.guild.premiumTier}
            \nRules channel ID: ${interaction.guild.rulesChannelId}
            \nPublic updates channel ID: ${interaction.guild.publicUpdatesChannelId}
            \nSystem channel ID: ${interaction.guild.systemChannelId}
            \nWidget channel ID: ${interaction.guild.widgetChannelId}
            \nUnavailable: ${interaction.guild.unavailable}
            \nLarge: ${interaction.guild.large}
            `
            await interaction.reply(message, {allowedMentions: {parse: []}});
        
        }

    },
};
