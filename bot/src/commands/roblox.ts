import noblox, { ThumbnailRequest, GroupIconSize } from 'noblox.js';

export async function getRobloxUserInfo(userId: number) {
    const user = await noblox.getPlayerInfo(userId);
    return user;
}

export async function getRobloxIdFromUsername(username: string) {
    const id = await noblox.getIdFromUsername(username);
    return id;
}

export async function getUserID(identifier: string | number): Promise<number> {

    let id: number;
    if (isNaN(Number(identifier))) {
        // get the id from the username
        id = await getRobloxIdFromUsername(identifier as string);

    }
    else {
        // get the id from the user id
        id = Number(identifier);
    }

    return id;
}

import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, EmbedBuilder, EmbedFooterOptions } from 'discord.js';

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('roblox')
        .setDescription('Gets information from Roblox')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get information about a user')
                .addStringOption(option =>
                    option.setName('target')
                        .setDescription('The user to get information about')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('group')
                .setDescription('Get information about a group')
                .addIntegerOption(option =>
                    option.setName('target')
                        .setDescription('The group ID to get information about')
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.options.getSubcommand() === 'user') {
            // differentiate between a user id and a username. So if we use 192276135 else we need to lookup
            const target = interaction.options.getString('target') as string;

            // get the user
            const id = await getUserID(target);

            if (!id) {
                await interaction.reply({ content: 'User not found', ephemeral: true });
                return;
            }

            // get the user info
            const user = await getRobloxUserInfo(id);

            // get avatar thumbnail
            const avatar = await noblox.getPlayerThumbnail(id, 720, "png");

            let oldNames = user.oldNames.join(", ");

            if (oldNames === "") {
                oldNames = "None";
            }

            // console.log(avatar);
            const embed = (new EmbedBuilder() as EmbedBuilder)
                .setTitle(`${user.username}`)
                .setDescription(`ID: ${id}`)
                .setColor(0x00ff00)
                .setImage(avatar[0].imageUrl)
                .addFields([
                    {
                        name: 'Display Name',
                        value: user.displayName.toString(),
                        inline: true
                    },
                    { name: 'Age', value: "<t:" + Math.floor(user.joinDate.getTime() / 1000) + ":R>", inline: true },
                    { name: 'Friends', value: user.friendCount.toString(), inline: true },
                    { name: 'Followers', value: user.followerCount.toString(), inline: true },
                    { name: 'Following', value: user.followingCount.toString(), inline: true },
                    { name: 'Old Names', value: oldNames, inline: true },
                    { name: 'Banned', value: user.isBanned.toString(), inline: true },


                ])
                .setTimestamp(new Date())

            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'group') {
            const id = interaction.options.getInteger('target') as number;

            const group = await noblox.getGroup(id);

            await interaction.deferReply();


            if (!group) {
                await interaction.editReply('Group not found');
                return;
            }

            const thumbnail = {
                targetId: id,
                size: "420x420" as GroupIconSize,
                type: "GroupIcon",
            } as ThumbnailRequest;
            /*
            [
  {
    requestId: null,
    errorCode: 0,
    errorMessage: '',
    targetId: 8144018,
    state: 'Completed',
    imageUrl: 'https://tr.rbxcdn.com/dcf32a4856341a90d50bd927727c41b7/420/420/Image/Png'
  }
]
            */
            const icon = await noblox.getThumbnails([thumbnail] as ThumbnailRequest[]);
            const iconURL = icon[0].imageUrl;


            // console.log(iconURL);

            const embed = (new EmbedBuilder() as EmbedBuilder)
                .setTitle(`${group.name}`)
                .setDescription(`ID: ${id}`)
                .setColor(0x00ff00)
                .setImage(iconURL)
                .addFields([
                    { name: 'Description', value: group.description, inline: true },
                    { name: 'Owner', value: group.owner.username, inline: true },
                    { name: 'Member Count', value: group.memberCount.toString(), inline: true },
                    { name: 'Public Entry Allowed', value: group.publicEntryAllowed.toString(), inline: true },
                    { name: 'Shout', value: group.shout.body, inline: false },

                    { name: 'Shout Poster', value: group.shout.poster.username, inline: true },
                    { name: 'Shout Posted', value: "<t:" + Math.floor(group.shout.updated.getTime() / 1000) + ":R>", inline: true },
                ])

            await interaction.editReply({ embeds: [embed] });
        }
    }
}
