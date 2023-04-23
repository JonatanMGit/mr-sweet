import { Events, Client } from '@slack/client';

const client = new Client();

client.on(Events.InteractionCreate, async (interaction) => {
  // Check if the interaction is a chat input command
  if (!interaction.isChatInputCommand()) {
    return;
  }

  // Check if the command name is 'support'
  if (interaction.commandName === 'support') {
    // Reply with discord.gg/jE66NtBZZe
    try {
      await interaction.reply({ content: 'discord.gg/jE66NtBZZe', ephemeral: true });
    } catch (err) {
      console.error(err);
    }
  }
});