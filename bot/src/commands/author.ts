import { ContextMenuCommandBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction, } from "discord.js";
import { getSaid } from "../db";
import client from "..";
import { IGNORED_IDs } from "..";



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
            if (said && !said.dataValues.hidden) {
                interaction.targetMessage.reply("Author: <@" + said.dataValues.user_id + ">");
                interaction.deferReply({ ephemeral: true });
                interaction.deleteReply();
            } else if (said && said.dataValues.hidden) {

                // if user is in allowed ids ask with a button if they want to reveal the author
                // if they click yes reveal the author
                // if they click delete the prompt
                if (IGNORED_IDs.includes(interaction.user.id)) {
                    interaction.deferReply({ ephemeral: true });

                    const button = new ButtonBuilder()
                        .setCustomId("reveal")
                        .setLabel("Reveal")
                        .setStyle(ButtonStyle.Success);
                    const button2 = new ButtonBuilder()
                        .setCustomId("ignore")
                        .setLabel("Ignore")
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder()
                        .addComponents(button, button2);


                    // send dm to user with the message

                    const member = interaction.guild.members.cache.get(interaction.user.id);

                    if (member) {
                        const message = member.send({
                            content: `Are you sure you want to reveal the author of this message?`,
                            //@ts-ignore
                            components: [row],
                        });

                        const collectorFilter = (i: ButtonInteraction) => {
                            return (i.user.id === interaction.user.id && (i.customId === "reveal" || i.customId === "ignore"));
                        };
                        const collector = message.then((message) => {
                            return message.createMessageComponentCollector({
                                filter: collectorFilter,
                                time: 60000,
                            });
                        }
                        );

                        collector.then((collector) => {
                            //console.log("collector created");
                            collector.on('collect', (i: ButtonInteraction) => {
                                //console.log("button clicked");
                                if (i.customId === "reveal") {
                                    interaction.targetMessage.reply("Author: <@" + said.dataValues.user_id + ">");
                                    i.update({ content: "You chose to reveal the author!", components: [] });
                                }
                                if (i.customId === "ignore") {
                                    i.update({ content: "You chose to not reveal the author!", components: [] });
                                }
                            });

                            collector.on('end', (collected, reason) => {
                                if (reason === 'time') {
                                    console.log("collector timed out");
                                    message.then((message) => {
                                        message.delete();
                                    });
                                }
                                interaction.deleteReply();
                            });
                        });
                    }
                } else {
                    const member = interaction.guild.members.cache.get(interaction.user.id);
                    if (member) {
                        member.send("https://miarecki.eu/img/BLEHHHHH_Cat.jpg");
                    }
                    interaction.deferReply({ ephemeral: true });
                    interaction.deleteReply();
                }
            } else {
                interaction.targetMessage.reply("This was sent by me!");
                interaction.deferReply({ ephemeral: true });
                interaction.deleteReply();
            }
        }
        );
    }
}
