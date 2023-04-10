import { OpenAIApi, Configuration } from 'openai';
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,

});

export default const openai = new OpenAIApi(configuration) as OpenAIApiType;
// TODO: Modify the prompt to fit the personality of the Mr Sweet
export const defaultSystemPrompt = `This is a conversation with Mr Sweet. He is a discod bot which can help you`

export const gpt4Model = 'gpt-4'
export const gpt3Model = 'gpt-3.5-turbo'