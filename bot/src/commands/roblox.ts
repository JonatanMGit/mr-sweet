import noblox, { ThumbnailRequest, GroupIconSize, AvatarOutfit, AvatarOutfitDetails } from 'noblox.js';

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
import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, EmbedFooterOptions, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, UserSelectMenuBuilder } from 'discord.js';

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
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('game')
                .setDescription('Get information about a game')
                .addIntegerOption(option =>
                    option.setName('target')
                        .setDescription('The game ID to get information about')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('outfit')
                .setDescription('Get information about all outfits of a user')
                .addStringOption(option =>
                    option.setName('target')
                        .setDescription('The user to get information about')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('asset')
                .setDescription('Get information about an asset')
                .addIntegerOption(option =>
                    option.setName('target')
                        .setDescription('The asset ID to get information about')
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
            await interaction.deferReply();
            const id = interaction.options.getInteger('target') as number;

            const group = await noblox.getGroup(id);




            if (!group) {
                await interaction.editReply('Group not found');
                return;
            }

            const thumbnail = {
                targetId: id,
                size: "420x420" as GroupIconSize,
                type: "GroupIcon",
            } as ThumbnailRequest;

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
            /*
        } else if (interaction.options.getSubcommand() === 'game') {
            const id = interaction.options.getInteger('target') as number;

            const game = await noblox.getUniverseInfo(id);
            console.log(game);

            await interaction.deferReply();

            if (!game) {
                await interaction.editReply('Game not found');
                return;
            }

            const thumbnail = {
                targetId: id,
                size: "420x420",
                type: "GameIcon",
            } as ThumbnailRequest;

            const icon = await noblox.getThumbnails([thumbnail] as ThumbnailRequest[]);
            const iconURL = icon[0].imageUrl;



            const embed = (new EmbedBuilder() as EmbedBuilder)
                .setTitle(`${game.name}`)
                .setDescription(`ID: ${id}`)
                .setColor(0x00ff00)
                .setImage(iconURL)
                .addFields(
                    { name: 'Description', value: game.description, inline: true },
                    { name: 'Price', value: game.price.toString(), inline: true },
                    { name: 'Genre', value: game.genre, inline: true },
                    { name: 'Allowed Gear Genres', value: game.allowedGearGenres.join(', '), inline: true },
                    { name: 'Allowed Gear Categories', value: game.allowedGearCategories.join(', '), inline: true },
                    { name: 'Is Genre Enforced', value: game.isGenreEnforced ? 'Yes' : 'No', inline: true },
                    { name: 'Copying Allowed', value: game.copyingAllowed ? 'Yes' : 'No', inline: true },
                    { name: 'Playing', value: game.playing.toString(), inline: true },
                    { name: 'Visits', value: game.visits.toString(), inline: true },
                    { name: 'Max Players', value: game.maxPlayers.toString(), inline: true },
                    { name: 'Created', value: game.created.toLocaleDateString(), inline: true },
                    { name: 'Updated', value: game.updated.toLocaleDateString(), inline: true },
                    { name: 'Studio Access to APIs Allowed', value: game.studioAccessToApisAllowed ? 'Yes' : 'No', inline: true },
                    { name: 'Create VIP Servers Allowed', value: game.createVipServersAllowed ? 'Yes' : 'No', inline: true },
                    { name: 'Universe Avatar Type', value: game.universeAvatarType, inline: true },
                    { name: 'Is All Genre', value: game.isAllGenre ? 'Yes' : 'No', inline: true },
                    { name: 'Is Favorited by User', value: game.isFavoritedByUser ? 'Yes' : 'No', inline: true },
                    { name: 'Favorited Count', value: game.favoritedCount.toString(), inline: true }
                );

            await interaction.editReply({ embeds: [embed] });
                    */
        }

        else if (interaction.options.getSubcommand() === 'outfit') {
            await interaction.deferReply();
            const id = await getUserID(interaction.options.getString('target'));

            const name = await noblox.getUsernameFromId(id);


            type Outfit = {
                id: number,
                name: string,
                isEditable: boolean,
            }

            let outfits: Outfit[] = []

            let currentOutfits = await noblox.outfits(id, 1, 100)
            let amountOutfits = currentOutfits.total
            currentOutfits.data.forEach((outfit) => {
                outfits.push({
                    id: outfit.id,
                    name: outfit.name,
                    isEditable: outfit.isEditable
                })
            })

            //console.log(currentOutfits)
            //console.log(outfits)
            // check if the size of currentOutfits is less than the amount of outfits the user has
            // repeat by increasing the pages so that we can get all the outfits
            // map out all the outfits and add them to the outfits array
            if (currentOutfits.data.length < amountOutfits) {
                let page = 2
                while (currentOutfits.data.length < amountOutfits) {
                    currentOutfits = await noblox.outfits(id, page, 100)
                    currentOutfits.data.forEach((outfit) => {
                        outfits.push({
                            id: outfit.id,
                            name: outfit.name,
                            isEditable: outfit.isEditable
                        })
                    })
                    page++
                }
            }


            const embed = (new EmbedBuilder() as EmbedBuilder)
                .setTitle(`Outfits for ${name}`)
                .setDescription(`ID: ${id}`)
                .setColor(0x00ff00)
                .addFields(
                    { name: 'Outfits', value: outfits.map((outfit) => `${outfit.name} - ${outfit.id}`).join('\n'), inline: true },
                );

            await interaction.editReply({ embeds: [embed] });

            const MAX_OPTIONS = 25;
            const outfitsCopy = [...outfits]; // make a copy of the original array

            let selectMenus = [];

            for (let i = 0; outfitsCopy.length > 0; i++) {
                const currentOutfits = outfitsCopy.splice(0, MAX_OPTIONS);

                const select = new StringSelectMenuBuilder()
                    .setCustomId(`outfit_select${i}`)
                    .setPlaceholder('Select an outfit')
                    .addOptions(currentOutfits.map((outfit) => {
                        return {
                            label: outfit.name,
                            value: (outfit.id.toString() + ',' + outfit.name),
                            description: outfit.isEditable ? 'Editable' : 'Not Editable',
                            default: false
                        }
                    }));

                selectMenus.push(select);
            }
            // console.log(selectMenus.length)

            // add each select menu to a row
            const rows = [];
            for (let i = 0; i < selectMenus.length; i++) {
                const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(selectMenus[i]);
                rows.push(row);
            }

            await interaction.editReply({ embeds: [embed], components: rows });


        } else {
            interaction.reply({ content: 'Not yet implemented :troll:', ephemeral: true });
        }
    },
    async handleSelectMenu(interaction: StringSelectMenuInteraction) {
        await interaction.deferUpdate();
        // get id and name from value split by comma and then join the name back together
        const [id_res, ...name] = interaction.values[0].split(',');

        const id = Number(id_res);
        // console.log(interaction.values)

        const thumbnail = {
            targetId: id,
            size: "150x150",
            type: "Outfit",
        } as ThumbnailRequest;

        const thumbnail_res = await noblox.getThumbnails([thumbnail] as ThumbnailRequest[]);
        //console.log(thumbnail_res)

        const image_url = thumbnail_res[0].imageUrl;

        const embed = (new EmbedBuilder() as EmbedBuilder)
            .setTitle(`Name ${name}`)
            .setDescription(`ID: ${id}`)
            .setColor(0x00ff00)
            .setImage(image_url);

        await interaction.editReply({ embeds: [embed] });



    }
}
