import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embedding";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("chatpdf-kevin");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
/*
import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embedding";
export async function getMatchesFromEmbedding(embeddings:number[],fileKey:string){

    console.log('fileKey:'+fileKey);
    
    try {
        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
        
        const index = await pinecone.index('chatpdf-kevin')
        const namespace = index.namespace(convertToAscii(fileKey))
        console.log('namespace:' + namespace)
        const queryResult = await index.query(
            {
                vector: embeddings,
                topK: 5,
                includeMetadata: true,
                namespace
            }
        )
        return queryResult.matches || [];
    } catch (error) {
        console.log('Error while getting matches from embedding')
        throw error
    }

}


export async function getContext(query:string,fileKey: string){
    const queryEmbedding = await getEmbeddings(query)
    const matches = await getMatchesFromEmbedding(queryEmbedding,fileKey)
    const qualifyingDocs = matches.filter(
        (match) => match.score && match.score> 0.0001
    );
    type Metadata = {
        text:string,
        pageNumber:number,
    }
    let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text)
    return docs.join('\n').substring(0,3000)

}
*/