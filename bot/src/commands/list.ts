import { getAllSettings, getGuilds, getSettings, getUsers, User } from "../db";
import { SlashCommandBuilder } from "@discordjs/builders";

let data = '';

module.exports = {
    global: false,
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('List information stored in the Bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('users')
                .setDescription('List all users in the database')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('tuilds')
                .setDescription('List all guilds in the database')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('settings')
                .setDescription('List all settings in the database')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'users') {
            const users = await getUsers();
            for (const user of users) {
                //data += `${user.id} ${user.openai_request_count} ${user.commands_used} ${user.v3tokens_used} ${user.v4tokens_used} hi\n`;
                data += `User <@${user.id}> has made ${user.openai_request_count} requests using ${user.v3tokens_used} v3 and ${user.v4tokens_used} v4 tokens\n`;

            }

        } else if (subcommand === 'guilds') {
            const guilds = await getGuilds();

            for (const guild of guilds) {
                data += `${guild.id} ${guild.name}\n`;
            }

        } else if (subcommand === 'settings') {
            const settings = await getAllSettings();

            for (const setting of settings) {
                data += `${setting.Guild} ${setting.enabled_commands}\n`;
            }
        }

        if (data.length > 2000) {
            data = data.slice(0, 2000);
        }

        if (data.length < 1) {
            data = 'No data found';
        }

        // check if the user has the role with the id 1055486015881613382
        if (interaction.member.roles.cache.has('1055486015881613382')) {
            await interaction.reply({ content: data, allowedMentions: { parse: [] } });
            return;
        }
        await interaction.reply('I don\'t I can allow you to do that');
    },
};