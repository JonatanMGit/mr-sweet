import { ChatInputCommandInteraction, Events, Interaction, MessageContextMenuCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
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
                const content = "'There was an error while executing this command!'"
                if (interaction.replied) {
                    await interaction.editReply({ content: content });
                } else {
                    await interaction.reply({ content: content, ephemeral: true });
                }
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            (interaction as MessageContextMenuCommandInteraction);
            const message = interaction.targetMessage.content;
            await interaction.reply({ content: message, ephemeral: true });
            // TODO: load commands from seperate files

        }
        else if (interaction.isStringSelectMenu()) {
            (interaction as StringSelectMenuInteraction);
            // TODO: load commands from seperate files
            if (interaction.customId.startsWith('outfit_select')) {
                const command = client.commands.get('roblox');

                command.handleSelectMenu(interaction);

            }
        } else if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    },
};