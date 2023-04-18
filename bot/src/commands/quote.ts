import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";


module.exports = {
    global: true,
    data: new ContextMenuCommandBuilder()
        .setName("Quote")
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        const message = interaction.targetMessage.content;
        await interaction.reply({ content: message, ephemeral: true });
    }
}
