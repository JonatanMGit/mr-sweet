import { OpenAIApi, Configuration } from 'openai';
require('dotenv').config();
import { ChatCompletionRequestMessage } from 'openai';
import { Readable } from 'stream'
import { count_openai_request, count_v3tokens, count_v4tokens } from './db';
import { encoding_for_model } from "@dqbd/tiktoken";
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

// messages is an array of messages from the discord channel
export type Message = {
    author: string;
    content: string;
}



export const getResponse = (messages: Message[], model: string) => {

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
    count_openai_request(user);
    // hash the user id
    const hash = require('crypto').createHash('sha256').update(user).digest('hex');

    // return "test"

    const response = openai.createChatCompletion({
        model: model,
        messages: message,
        max_tokens: 400,
        n: 1,
        user: hash,
        stream: true,
    }, { responseType: 'stream' });


    // https://github.com/openai/openai-node/issues/107
    return response as any;
}

export function count_tokens(messages: Message[], userid: string, model: "gpt-4" | "gpt-3.5-turbo" | any): void {
    // https://community.openai.com/t/do-you-get-billed-extra-when-echo-true/46502/3
    // https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
    const enc = encoding_for_model(model);

    let num_tokens = 0;
    let tokens_per_message = (model === "gpt-4") ? 3 : 4;
    let tokens_per_name = 1;

    // for each message
    for (let i = 0; i < messages.length; i++) {
        // add the tokens for the message
        num_tokens += tokens_per_message
        // for each field in the message (role, name, content if present)
        for (let field in messages[i]) {
            // add the tokens for the field
            if (field === "name") {
                num_tokens += tokens_per_name;
            }
            // add the tokens for the content
            num_tokens += enc.encode(messages[i][field]).length;

        }
    }
    // add the tokens to the database
    if (model === "gpt-4") {
        count_v4tokens(userid, num_tokens);
    }
    else {
        count_v3tokens(userid, num_tokens);
    }
    console.log(num_tokens);
    return;
}






