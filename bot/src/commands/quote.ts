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
        const guildmember = await message.guild.members.fetch(message.author.id)
        if (guildmember !== undefined) {

            avatarURL = guildmember.displayAvatarURL({ extension: "png", size: 4096 });
            console.log("in guild");

        } else {
            avatarURL = message.author.displayAvatarURL({ extension: "png", size: 4096 });
        }

        // console.log(avatarURL);
        const messageContent = message.content;
        const messageAuthor = message.author.username;

        const buffer = Buffer.from(await (await fetch(avatarURL)).arrayBuffer());
        const avatar = await loadImage(buffer);

        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext("2d");

        // Draw the avatar with the fade effect
        const gradient = ctx.createLinearGradient(0, 0, canvas.height, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        // black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();


        ctx.drawImage(avatar, 0, 0, canvas.height, canvas.height);
        // draw the gradient over the avatar
        ctx.fillStyle = gradient;
        // rotate the gradient 75 degrees
        ctx.rotate(75 * Math.PI / 180);
        // draw the gradient over the avatar starting from the top middle
        ctx.fillRect(0, -canvas.height * 1.5, canvas.height * 2, canvas.height);

        ctx.restore();


        // Draw the username and message
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(messageAuthor, canvas.height + 20, 50);
        ctx.font = 'bold 24px Arial';
        ctx.fillText(messageContent, canvas.height + 20, 100);


        // send the image
        message.reply({ files: [canvas.toBuffer()], flags: MessageFlags.SuppressNotifications, });


        interaction.deleteReply();
    }
}
