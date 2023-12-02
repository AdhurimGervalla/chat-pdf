
import {OpenAIApi, Configuration} from 'openai-edge';

export function getOpenAiApi(apiKey?: string | null): OpenAIApi {
    const config = new Configuration({
        apiKey: apiKey ?? process.env.OPENAI_API_KEY,
    });
    
    return new OpenAIApi(config);
}