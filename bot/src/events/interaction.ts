import { ChatInputCommandInteraction, Events, Interaction, MessageContextMenuCommandInteraction } from 'discord.js';
import { CustomClient } from '..';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        const client = interaction.client as CustomClient;
        if (interaction.isChatInputCommand()) {
            (interaction as ChatInputCommandInteraction);
            const command = client.commands.get(interaction.commandName)
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            (interaction as MessageContextMenuCommandInteraction);
            const message = interaction.targetMessage.content;
            await interaction.reply({ content: message, ephemeral: true });
            // TODO: load commands from seperate files

        }
    },
};