import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, User } from 'discord.js';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the avatar of')
                .setRequired(true)
        )
        .setDescription('Gets the avatar of a user'),
    async execute(interaction) {
        const user: User = interaction.options.getUser('user');
        if (user) {
            // max size image
            await interaction.reply(user.displayAvatarURL({ size: 4096 }));
        } else {
            await interaction.reply({ content: 'You did not provide a user to get the avatar of', ephemeral: true });
        }

    },
};
