import { SlashCommandBuilder } from '@discordjs/builders';
import { loadCommands, registerCommands } from '../commandUtils';
import { ChatInputCommandInteraction } from 'discord.js';
import client from '../index';
import { saveGuild } from '../db';

module.exports = {
  global: false,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a specific feature (DEBUG)")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("commands")
        .setDescription("Reloads all commands")
    ).addSubcommand((subcommand) =>
      subcommand
        .setName("guilds")
        .setDescription("Reloads all guilds")
        .addBooleanOption((option) =>
          option
            .setName("all")
            .setDescription("Refresh all guilds")
            .setRequired(false)
        )
    )
  ,

  async execute(interaction: ChatInputCommandInteraction) {
    // check if commands have to be reloaded
    if (interaction.options.getSubcommand() === "commands") {
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
    } else if (interaction.options.getSubcommand() === "guilds") {
      try {
        const all = interaction.options.getBoolean('all');
        if (all) {
          // get all guilds from client
          const guilds = interaction.client.guilds.cache;
          // save all guilds
          guilds.forEach(async (guild) => {
            await saveGuild(guild.id, guild.name);
          }
          );
          await interaction.reply('Refreshed all guilds!');
        } else {
          // get guild from interaction
          const guild = interaction.guild;
          // save guild
          await saveGuild(guild.id, guild.name);
          await interaction.reply('Refreshed guild!');
        }
      } catch (error) {
        interaction.reply({
          content: "There was an error while reloading the guilds!",
          ephemeral: true,
        });
      }
    }
  },
};