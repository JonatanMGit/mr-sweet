import { Events, AutoModerationActionExecution, TextChannel } from 'discord.js';
import { generateFakeData } from '../commands/hack';
// list of messages to respond
const messages = [
    "Wow, thats inappropriate!",
    "Hey, thats not nice!",
    "Please dont say that!",
    "🙀🙀🙀🙀",
    "🤬🤬🤬🤬",
    "😭😭😭",
    "Reported!",
    "👀👀👀👀",
    "https://media.tenor.com/G6fi9jKq9XAAAAAC/sploot-speech-bubble.gif",
    "https://media.tenor.com/SRX8X6DNF6QAAAAd/nerd-nerd-emoji.gif",
    "https://media.tenor.com/32zLXcYBbH8AAAAd/speech-bubble.gif",
    "wts",
    "https://tenor.com/de/view/family-guy-fart-meg-peter-gif-8122927",
    "https://media.discordapp.net/attachments/813852446069751842/1079177556537905264/40dffb8650781dabdae0b21f72da71ce.jpg",
    "1",
    "1"
];



module.exports = {
    name: Events.AutoModerationActionExecution,
    async execute(excecution: AutoModerationActionExecution) {
        if (excecution.guild.id !== "813852446069751838") return;

        // if the action is a message delete reply to the channel instead of the message
        if (excecution.action.type === 2) {
            const channel = await excecution.guild.channels.cache.get(excecution.channelId) as TextChannel;
            if (!channel) {
                console.error(`No channel matching ${excecution.channelId} was found.`);
                return;
            }

            const message = await channel.messages.fetch(excecution.messageId);
            if (!message) {
                console.error(`No message matching ${excecution.messageId} was found.`);
                return;
            }
            try {
                let reply = messages[Math.floor(Math.random() * messages.length)];
                if (reply === "1") {
                    reply = await generateFakeData(message.author.id, true);
                }
                await message.reply(reply);
            } catch (error) {
                console.error(error);
            }
        }
    }
}