import { getAllSettings, getGuilds, getSettings, getUsers, Settings, User } from "../db";
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
        ).addSubcommand(subcommand =>
            subcommand
                .setName('costs')
                .setDescription('List the users which cost the most')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'users') {
            const users = await getUsers();
            for (const user of users) {
                //data += `${user.id} ${user.openai_request_count} ${user.commands_used} ${user.v3tokens_used} ${user.v4tokens_used} hi\n`;
                data += `User <@${user.id}> has made ${user.openai_request_count} requests using ${user.v3tokens_used} v3 and ${user.v4tokens_prompt_used + user.v4tokens_completion_used} v4 tokens\n`;

            }

        } else if (subcommand === 'guilds') {
            const guilds = await getGuilds();

            for (const guild of guilds) {
                data += `${guild.id} ${guild.name}\n`;
            }

        } else if (subcommand === 'settings') {
            const settings = await getAllSettings();

            for (const setting of settings) {
                data += `${setting.id} ${setting.enabledCommands}\n`;
            }
        }
        else if (subcommand === 'costs') {
            const users = await getUsers();
            users.sort((a, b) => {
                return (b.v3tokens_used + b.v4tokens_prompt_used + b.v4tokens_completion_used) - (a.v3tokens_used + a.v4tokens_prompt_used + b.v4tokens_completion_used);
            });
            // price of token from openai: gpt-3: $0.002 / 1K tokens gp-4: $0.03 / 1K tokens
            for (const user of users) {
                data += `User <@${user.id}> has used ${user.v3tokens_used} v3 and ${user.v4tokens_prompt_used + user.v4tokens_completion_used} v4 tokens
Total: ${user.v3tokens_used + user.v4tokens_prompt_used + user.v4tokens_completion_used}
Cost: ${(user.v3tokens_used / 1000 * 0.002 + (user.v4tokens_prompt_used / 1000 * 0.03) + (user.v4tokens_completion_used / 1000 * 0.06)).toFixed(2)} USD\n`;
            }
        }


        if (data.length > 2000) {
            data = data.slice(0, 2000);
        }

        if (data.length < 1) {
            data = 'No data found';
        }

        // check if the user has the role with the id 1055486015881613382
        if (interaction.member.roles.cache.has('1129197582900527225')) {
            await interaction.reply({ content: data, allowedMentions: { parse: [] } });
            return;
        }
        await interaction.reply('I can\'t allow you to do that');
    },
};