import { ContextMenuCommandBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js";
import { getSaid } from "../db";
import client from "..";


module.exports = {
    global: true,
    data: new ContextMenuCommandBuilder()
        .setName("Author")
        .setType(ApplicationCommandType.Message),
    async execute(interaction: MessageContextMenuCommandInteraction) {
        if (interaction.targetMessage.author.id !== client.user.id) {
            interaction.reply({ content: "I didn't say that!", ephemeral: true });
            return;
        }

        getSaid(interaction.targetMessage).then((said) => {
            if (said) {
                interaction.targetMessage.reply("Author: <@" + said.dataValues.user_id + ">");
                interaction.deferReply({ ephemeral: true });
                interaction.deleteReply();
            }
            else {
                interaction.targetMessage.reply("No author found! It could be the real Mr Sweet!");
                interaction.deferReply({ ephemeral: true });
                interaction.deleteReply();
            }
        });
    }
};
