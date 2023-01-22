import { getUsers, User } from "../db";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Leacks all users in the database'),
    async execute(interaction) {
        if (interaction.user.id !== "337853846158180352") {
            await interaction.reply({ content: 'You are not the bot owner!', ephemeral: true });
            return;
        }
        const users: User[] = await getUsers();
        interaction.channel.send("Pro Gamers:");
        users.forEach(user => {

            interaction.channel.send(`<@${user.id}>`);

        });
    },
};
