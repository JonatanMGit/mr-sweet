import { ContextMenuCommandBuilder, ApplicationCommandType, MessageContextMenuCommandInteraction, MessageFlags } from "discord.js";
import { createCanvas, loadImage } from "canvas";


module.exports = {
    global: true,
    data: new ContextMenuCommandBuilder()
        .setName("Quote")
        .setType(ApplicationCommandType.Message),
    async execute(interaction: MessageContextMenuCommandInteraction) {
        const message = interaction.targetMessage;

        await interaction.deferReply({ ephemeral: true });
        let avatarURL: string;
        // check if user is in the guild (guild avatar) or not (default avatar)
        // check if user is a member of the guild
        try {
            const guildmember = await message.guild.members.fetch(message.author.id)

            if (guildmember !== undefined) {

                avatarURL = guildmember.displayAvatarURL({ extension: "png", size: 4096 });
                console.log("in guild");

            } else {
                avatarURL = message.author.displayAvatarURL({ extension: "png", size: 4096 });
            }
        }
        catch (error) {
            // user does not exist 
            // use default avatar random color
            avatarURL = "https://cdn.discordapp.com/embed/avatars/" + (Math.floor(Math.random() * 5) + 1) + ".png";
        }

        // console.log(avatarURL);
        const messageContent = message.content;
        const messageAuthor = message.author.username;

        const buffer = Buffer.from(await (await fetch(avatarURL)).arrayBuffer());
        const avatar = await loadImage(buffer);

        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext("2d");

        // black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();


        ctx.drawImage(avatar, 0, 0, canvas.height, canvas.height);
        // draw the gradient over the avatar
        // it should be a gradient from transparent to black (left to right darkening) at a 45 degree angle
        const gradient = ctx.createLinearGradient(0, 0, canvas.height, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.95, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.height, canvas.height);

        ctx.restore();


        // Draw the username and message
        /*
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(messageAuthor, canvas.height + 20, 50);
        ctx.font = 'bold 24px Arial';
        ctx.fillText(messageContent, canvas.height + 20, 100);
        */

        // Draw the username and message but make the message wrap
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        // put the text centered in the middle of the right side of the quote
        ctx.fillText(messageAuthor, canvas.height + 100, 50, canvas.height - 40);
        ctx.font = 'bold 24px Arial';
        const words = messageContent.split(" ");
        let line = "";
        let lineCount = 0;
        for (const word of words) {
            if (ctx.measureText(line + word).width > canvas.width - canvas.height - 20) {
                ctx.fillText(line, canvas.height + 20, 100 + 50 * lineCount);
                line = word + " ";
                lineCount++;
            } else {
                line += word + " ";
            }
        }
        ctx.fillText(line, canvas.height + 20, 100 + 50 * lineCount);




        // send the image
        message.reply({ files: [canvas.toBuffer()], flags: MessageFlags.SuppressNotifications, });


        interaction.deleteReply();
    }
}
