import noblox from 'noblox.js';

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
                        .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.options.getSubcommand() === 'user') {
            // differentiate between a user id and a username. So if we use 192276135 else we need to lookup
            const target = interaction.options.getString('target') as string;

            // get the user
            const id = await getUserID(target);

            // get the user info
            const user = await getRobloxUserInfo(id);

            // get avatar thumbnail
            const avatar = await noblox.getPlayerThumbnail(id, 720, "png");

            let oldNames = user.oldNames.join(", ");

            if (oldNames === "") {
                oldNames = "None";
            }

            console.log(avatar);
            const footer = { text: 'Roblox', iconURL: 'https://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&Format=Png&username=Roblox' } as EmbedFooterOptions;
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
        }
    }
}
