import { GuildMember } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    global: true,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user").
        addUserOption(option => option.setName("user").setDescription("The user to kick").setRequired(true)).
        addStringOption(option => option.setName("reason").setDescription("The reason for the kick").setRequired(false)),
    async execute(interaction) {
        // check if the user has the permission to kick (ephermal)
        if (!interaction.member.permissions.has("KICK_MEMBERS")) {
            await interaction.reply({ content: "You don't have the permission to kick members", ephemeral: true });
            return;
        }
        // check if the bot has the permission to kick
        if (!interaction.guild.me.permissions.has("KICK_MEMBERS")) {
            await interaction.reply("I don't have the permission to kick members");
            return;
        }
        // get the user to kick
        const user = interaction.options.getUser("user") as GuildMember;

        // check if the user is kickable
        if (!user.kickable) {
            await interaction.reply({ content: "I can't kick this user", ephemeral: true });
            return;
        }

        const reason = interaction.options.getString("reason");

        // send dm to user
        let message = `You have been kicked from ${interaction.guild.name}`;
        if (reason) {
            message += ` for ${reason}`;
        }
        await user.send(message);

        // kick the user
        await interaction.guild.members.kick(user, { reason: reason });
        await interaction.reply(`Kicked ${user}`);
    },
};
