import { ChannelType, Events, Message } from 'discord.js';
import { getResponse, gpt3Model, gpt4Model } from '../ai';
import { RateLimiter } from 'discord.js-rate-limiter';
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {

        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;

        // if the message is in the channel with the id 1096122391513542697
        if (message.channel.id === "1096122391513542697" || message.channel.id == "1096189924748832788") {
            // check if the message isnt too long
            if (message.content.length > 1000) {
                message.reply("Your message is too long!");
                return;
            }
            let limited = rateLimiter.take(message.author.id);
            if (limited) {
                // Send back a message (or you may want to just drop the request)
                const rep_msg = await message.reply("You are sending messages too fast!");
                // delete the message after 3 seconds
                setTimeout(() => {
                    message.delete();
                    rep_msg.delete();
                }, 3000);
                return;
            }


            // get the 10 last messages in the channel
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

            // the response is a data only stream so we need to listen to the data event and then periodically update the message
            // so send the initial data and then update the message with the new data
            // the data event is called multiple times so we need to store the data in a variable and then update the message

            let data = '';

            const msg = await message.channel.send("Thinking...");

            // update the message with the new data every 1 seconds until the stream is finished
            const interval = setInterval(() => {
                msg.edit(data);
            }, 1000);

            response.data.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                // console.log(lines);
                for (const line of lines) {
                    const message = line.replace(/^data: /, '');
                    //console.log(message);
                    if (message === '[DONE]') {
                        return; // Stream finished
                    }
                    // 'data: {"id":"chatcmpl-74zxn7a2AWCIAhAezt6fULY64RgSi","object":"chat.completion.chunk","created":1681425855,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" you"},"index":0,"finish_reason":null}]}'
                    const parsed = JSON.parse(message);
                    if (parsed.choices && parsed.choices[0].delta.content !== undefined) {
                        // fix bug where the data is undefined
                        data += parsed.choices[0].delta.content;
                    }
                }
            });
            // stop the interval when the stream is finished, but mak
            response.data.on('end', () => {
                clearInterval(interval);
                msg.edit(data);
            });

        }
    },
};