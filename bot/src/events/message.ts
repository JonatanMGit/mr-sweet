import { ChannelType, Events, Message } from 'discord.js';
import { getResponse, gpt3Model, gpt4Model } from '../ai';

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {

        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;
        console.log(message.content);

        // if the message is in the channel with the id 1096122391513542697
        if (message.channel.id === "1096122391513542697" || message.channel.id == "1096189924748832788") {
            // get the 3 last messages in the channel
            const messageArray = await message.channel.messages.fetch({ limit: 10 });

            const messagesData = messageArray.map((msg) => ({
                author: msg.author.id,
                content: msg.content,
            }));

            messagesData.reverse();

            // console.log(messagesData);

            // console.log(messages);
            // get the response from the ai

            // make the model depend on the channel id the first one is gpt4 the second one is gpt3
            const Model = message.channel.id === "1096122391513542697" ? gpt4Model : gpt3Model;
            const response = await getResponse(messagesData, Model);

            // let response = "test";

            console.log(response);

            // send the response
            await message.channel.send(response);
        }


    }
};