import {OpenAIApi,Configuration} from 'openai-edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getEmbeddings(text:string) {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g,''),

        })
        const result = await response.json()
        if (!result || !result.data || result.data.length === 0) {
            throw new Error('Invalid API response')
        }
        //console.log('embeddings', result.data[0].embedding)
        return result.data[0].embedding as number[]
    }catch(error){
        console.log('error calling openai embeddings api', error)
        throw error
    }
    
}
