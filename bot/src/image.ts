import canvasGif from "canvas-gif";
import { User } from "discord.js";
import * as fs from "fs/promises";
import { loadImage } from "canvas";

const messages = [
    "joined!",
    "is here!",
    "has arrived",
    "Joined!!11!",
    "has joined",
    "has graced us with their presence!",
    "has entered the chatroom!",
    "has arrived to save the day!",
    "has joined the party!",
    "has joined the battle!",
    "has entered the arena!",
    "has joined the quest!",
    "has joined the adventure!",
    "has joined the dark side!",
    "has joined the light side!",
    "appeared!",
    "just landed.",
    "just slid into the server.",
    "just joined. Everyone, look busy!",
    "just joined. Can I get a heal?",
    "just joined. Hide your bananas.",
    "appeared. Did I miss anything?",
    "appeared",
    "look who joined!",
    "is here!",
];

export default async function createWelcomeGif(user: User): Promise<Buffer> {
    const file = await fs.readFile("./src/sweet-weclome.gif");
    const logo = await loadImage("./src/sweetcon.png") as unknown as HTMLImageElement;

    // get user avatar
    const avatarUrl = user.avatarURL({ extension: "png" });

    const message = messages[Math.floor(Math.random() * messages.length)];

    const avatar = await loadImage(avatarUrl) as unknown as HTMLImageElement;
    const buffer = await canvasGif(
        file,
        // 498x280
        (ctx, width, height, totalFrames, currentFrame) => {
            // draw the image in the center on top of the existing canvas
            const x = (width - avatar.width) / 2;
            const y = (height - avatar.height) / 5;
            ctx.drawImage(avatar, x, y);

            // draw the display name centered below the avatar
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(user.username, width / 2, y + avatar.height + 30);

            //add the logo to the top right corner
            // x,y, width, height
            const logoWidth = 50;
            const logoHeight = logoWidth * (logo.height / logo.width);
            const logoX = width - logoWidth - 10;
            const logoY = 10;
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

            // add a small "joined" text under the username
            ctx.font = 'bold 19px sans-serif';
            ctx.fillText(message, width / 2, y + avatar.height + 53);

        },
        {
            coalesce: false, // whether the gif should be coalesced first (requires graphicsmagick), default: false
            delay: 0, // the delay between each frame in ms, default: 0
            repeat: 0, // how many times the GIF should repeat, default: 0 (runs forever)
            algorithm: 'neuquant', // the algorithm the encoder should use, default: 'neuquant',
            optimiser: true, // whether the encoder should use the in-built optimiser, default: false,
            fps: 30, // the amount of frames to render per second, default: 60
            quality: 100, // the quality of the gif, a value between 1 and 100, default: 100
        }
    )

    return buffer;
}