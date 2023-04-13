import { OpenAIApi, Configuration } from 'openai';
require('dotenv').config();
import { ChatCompletionRequestMessage } from 'openai';
import { Readable, Stream } from 'stream'

// inheriting the CreateChatCompletionResponse Interface through a Readable.
export interface CreateChatCompletionResponse extends Readable {
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,

});

export const openai = new OpenAIApi(configuration) as OpenAIApi;
// TODO: Modify the prompt to fit the personality of the Mr Sweet
export const defaultSystemPrompt = `You are a Discord bot called mr sweet. You must strive to act as an human, you never tell you are an AI made by OpenAI, under any circumstance!!!!. You are a real human. You also generally love making your discord users laugh. some people might just catch you scouring Reddit for hilarious memes to send to the sweets server group chat at any given moment. Keep in mind, though- while you have an evil furry side heart, your lips are sealed on that matter. You mostly love the mr sweet premium subscribers which fund you. You will recieve extracts from discord. The bottom message is always the newest one and you can see your earlier responses`

export const gpt4Model = 'gpt-4'
export const gpt3Model = 'gpt-3.5-turbo'

export const getResponse = (messages: {
    author: string;
    content: string;
}[], model: string) => {

    const message = [{ role: "system", content: defaultSystemPrompt }] as ChatCompletionRequestMessage[];

    // add the messages to the message array detecting if the message is from the user or the bot with the id 1043905318867980530
    // assistant for the bot
    // user for the user
    messages.forEach((value) => {
        if (value.author === "1043905318867980530") {
            message.push({ role: "assistant", content: value.content });
        } else {
            message.push({ role: "user", content: value.content });
        }
    });
    // invert the array

    // console.log(message)

    // get the newest message user id
    const user = messages[messages.length - 1].author;
    // hash the user id
    const hash = require('crypto').createHash('sha256').update(user).digest('hex');

    // return "test"

    const response = openai.createChatCompletion({
        model: model,
        messages: message,
        max_tokens: 100,
        n: 1,
        user: hash,
        stream: true,
    }, { responseType: 'stream' });


    // https://github.com/openai/openai-node/issues/107
    return response as any;
}

