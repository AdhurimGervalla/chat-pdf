
import {OpenAIApi, Configuration} from 'openai-edge';

export function getOpenAiApi(apiKey: string): OpenAIApi {
    const config = new Configuration({
        apiKey: apiKey,
    });
    
    return new OpenAIApi(config);
}