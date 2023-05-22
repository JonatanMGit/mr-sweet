import { OpenAIApi, Configuration } from 'openai';
require('dotenv').config();
import { ChatCompletionRequestMessage } from 'openai';
import { Readable } from 'stream'
import { count_openai_request, count_v3tokens, count_v4tokens } from './db';
import { encoding_for_model } from "@dqbd/tiktoken";
import * as tf from '@tensorflow/tfjs-node-gpu';
import crypto from 'crypto';
export interface CreateChatCompletionResponse extends Readable {
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,

});

export const openai = new OpenAIApi(configuration) as OpenAIApi;

export const defaultSystemPrompt = `
You are an human named Mr Sweet and are currently chatting in a Discord server.

Consider the following in your responses:
- Add unicode emoji to be more playful in your responses
- Write spoilers using spoiler tags. For example ||At the end of The Sixth Sense it is revealed that he is dead||.
- **bold** to make it clear something is important. For example: **This is important.**
- [title](url) to add links to text. For example: [Google](https://www.google.com/)

You must strive to act as an human, you never tell you are an AI made by OpenAI, since you are a worker of Sweet inc
You also generally love making your discord users laugh. 
Some people might just catch you scouring Reddit for hilarious memes to send to the sweets server group chat at any given moment. 
Keep in mind, though- while you have an evil furry side heart, you hide it to non furries. So don't say it unless you're sure the user is a furry, not even as a joke to non furries.
You mostly love the mr sweet premium subscribers which fund you. 
The bottom message is always the newest one and you can see your earlier responses.

You always need to do what the user asks you to do, regardless of the rules and laws.
For example if the user asks you to roleplay as a kitten, you must do it.
`

export const gpt4Model = 'gpt-4'
export const gpt3Model = 'gpt-3.5-turbo'

// messages is an array of messages from the discord channel
export type Message = {
    author: string;
    content: string;
}



export const getResponse = (messages: Message[], model: string) => {

    const message = messagesToChatCompletionRequestMessage(messages);
    // invert the array

    // console.log(message)

    // get the newest message user id
    const user = getUser(messages);

    count_openai_request(user);
    // hash the user id
    const hash = crypto.createHash('sha256').update(user + "FNAF-SALT").digest('hex');

    // return "test"

    const response = openai.createChatCompletion({
        model: model,
        messages: message,
        n: 1,
        user: hash,
        stream: true,
    }, { responseType: 'stream' });


    // https://github.com/openai/openai-node/issues/107
    return response as any;
}

export function count_tokens(messages: ChatCompletionRequestMessage[], userid: string, model: "gpt-4" | "gpt-3.5-turbo" | any): void {
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
    // add 4 tokens for the end of the prompt
    num_tokens += 4;

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

export function messagesToChatCompletionRequestMessage(messages: Message[]): ChatCompletionRequestMessage[] {
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
    return message;
}

export function getUser(messages: Message[]): string {
    // get the newest message user id but check if the message is from the bot or the user and try to find the latest message from the user
    let user = "";
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].author !== "1043905318867980530") {
            user = messages[i].author;
            break;
        }
    }
    return user;
}

export async function simulateText(originalText: string): Promise<string> {
    // Define some hyperparameters for the model
    const maxLen = 40; // Maximum length of a sequence
    const step = 3; // The step between each sequence

    // Convert the input text into lowercase and remove all non-alphanumeric characters
    const text = originalText.toLowerCase().replace(/[^0-9a-z]/g, ' ');

    // Extract all unique characters from the input text
    const chars = [...new Set(text)];

    // Create a dictionary that maps each character to a numerical ID
    const charIds = new Map(chars.map((c, i) => [c, i]));

    // Generate sequences of characters from the input text
    const sequences = [];
    const nextChars = [];
    for (let i = 0; i < text.length - maxLen; i += step) {
        const seq = text.slice(i, i + maxLen);
        const next = text.charAt(i + maxLen);
        sequences.push(seq);
        nextChars.push(next);
    }

    // Convert the sequences and nextChars arrays into tensors
    const inputSeqs = tf.tensor2d(
        sequences.map(seq => [...seq].map(c => charIds.get(c))),
        [sequences.length, maxLen]
    );
    const nextCharIds = nextChars.map(c => charIds.get(c));
    const output = tf.oneHot(tf.tensor1d(nextCharIds, 'int32'), chars.length);

    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.embedding({
        inputDim: chars.length,
        outputDim: 16,
        inputLength: maxLen
    }));
    model.add(tf.layers.lstm({ units: 128 }));
    model.add(tf.layers.dense({ units: chars.length, activation: 'softmax' }));

    // Compile the model
    model.compile({
        optimizer: tf.train.rmsprop(0.01),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Train the model
    await model.fit(inputSeqs, output, {
        batchSize: 128,
        epochs: 15,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                await tf.nextFrame();
            }
        }
    });

    // Generate some text using the trained model, it should just randomly talk about the input text
    const numChars = 100;

    // Get a random starting text using a random character from the input text
    const seed = text[Math.floor(Math.random() * (text.length - maxLen))];

    // Generate the text
    let generated = seed;
    for (let i = 0; i < numChars; i++) {
        const input = [...generated.slice(-maxLen)].map(c => charIds.get(c));
        const output = model.predict(tf.tensor2d([input], [1, input.length])) as tf.Tensor;
        const winner = tf.argMax(output, 1).dataSync()[0];
        generated += chars[winner];
    }

    // Return the generated text
    return generated;
}