import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the bot'),
    async execute(interaction) {
        await interaction.reply({
            content: 'This bot is currently invite only.\nDon\'t miss out on all the exclusive features of this bot! Only select members have access. Get in on the action by having a member with access invite you!', ephemeral: true
        });
    },
};
