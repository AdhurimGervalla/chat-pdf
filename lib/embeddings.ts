import {OpenAIApi, Configuration} from 'openai-edge'

/**
 * Creates embeddings for the given text
 * An embedding is a 512-dimensional vector that represents the meaning of the text in the context of the model.
 * @param text text to embed
 * @returns 
 */
export async function getEmbeddings(text: string, apiKey: string) {
    if (!apiKey) {
        throw new Error('API key is required');
    }
    const config = new Configuration({
        apiKey
    });
    
    const openai = new OpenAIApi(config);

    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, '')
        });

        const result = await response.json();
        return result.data[0].embedding as number[];
    } catch (error) {
        console.log('error calling openai embeddings', error);
        throw error;
    }
}