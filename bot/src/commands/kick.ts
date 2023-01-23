const { SlashCommandBuilder } = require("@discordjs/builders");
const { registerCommands, loadCommands } = require("../commandUtils.js");

module.exports = {
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
        const user = interaction.options.getUser("user");

        const reason = interaction.options.getString("reason");
        // kick the user
        await interaction.guild.members.kick(user, { reason: reason });
        await interaction.reply(`Kicked ${user}`);
    },
};
