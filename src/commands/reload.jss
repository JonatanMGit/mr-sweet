const { SlashCommandBuilder } = require("@discordjs/builders");
const { registerCommands, loadCommands } = require("../commandUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads all commands"),
  async execute(interaction) {
    try {
      registerCommands(client);
      loadCommands(client);
    } catch (error) {
      interaction.reply({
        content: "There was an error while reloading the commands!",
        ephemeral: true,
      });
    }
    interaction.reply("Reloaded all commands!");
  },
};
