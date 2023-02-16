import { Events, AutoModerationActionExecution, TextChannel } from 'discord.js';

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
];



module.exports = {
    name: Events.AutoModerationActionExecution,
    async execute(excecution: AutoModerationActionExecution) {
        // get the message that triggered the action so that we can reply to it
        const messageid = excecution.messageId;
        const channelid = excecution.channelId;

        // limit the messages to only respond to messages in the guild with the id 813852446069751838
        if (excecution.guild.id !== "813852446069751838") return;

        const channel = await excecution.guild.channels.cache.get(channelid) as TextChannel;
        if (!channel) {
            console.error(`No channel matching ${channelid} was found.`);
            return;
        }

        const message = await channel.messages.fetch(messageid);
        if (!message) {
            console.error(`No message matching ${messageid} was found.`);
            return;
        }

        // reply to the message with a chance of 50%
        if (Math.random() < 0.5)
            await message.reply(messages[Math.floor(Math.random() * messages.length)]);

    }
};