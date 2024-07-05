import { Pinecone,PineconeRecord } from "@pinecone-database/pinecone";
import { downloadS3File } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { Document,RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import {getEmbeddings} from "./embedding";
import md5 from "md5";
import { metadata } from "@/app/layout";
import { convertToAscii } from "./utils";

let pinecone:Pinecone | null = null

export const getPinecone = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
    pageContent: string,
    metadata:{
        loc:{pageNumber:number}
    }
}

/**
 * Loads a PDF file from an S3 bucket and ingests it into a Pinecone vector index.
 *
 * @param fileKey - The S3 key of the PDF file to load.
 * @returns A Promise that resolves to an array of LangChain Document objects representing the pages of the PDF.
 */
export async function loadS3IntoPinecone(fileKey:string){
    // 1.obtain the pdf -> download and read from pdf
    console.log("downloading s3 into file system");
    const fileName = await downloadS3File(fileKey);
    
    if (!fileName) {
        throw new Error("could not download from s3");
    }
    
    const loader = new PDFLoader(fileName);
    const pages = (await loader.load()) as PDFPage[];
    console.log("pages", pages);
    // 2.split and segment the pdf
    // pages = Array(pages)
    const documents = await Promise.all(pages.map(prepareDocument))
    
    // 3.vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // 4. upload to pincone
    const client = await getPinecone();
    const pineconeIndex = client.index('chatpdf-kevin')

    console.log('inserting vectors into pinecone');
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    await namespace.upsert(vectors);

    return documents[0]
    
}

async function embedDocument(doc:Document){
   try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
        id: hash,
        values: embeddings,
        metadata: {
            text: doc.metadata.text,
            pageNumber: doc.metadata.pageNumber,
        },
        } as PineconeRecord;
   } catch (error) {
        console.log("error embedding document", error);
        throw error;
   }
}   

export const truncateStringByBytes = (str:string,bytes:number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0,bytes))
}   

async function prepareDocument(page:PDFPage) {
    let { pageContent, metadata } = page
    pageContent = pageContent.replace(/[\n\r]/g, " ")
    //split the docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata:
            {
                    pageNumber: metadata.loc.pageNumber,
                    text: truncateStringByBytes(pageContent, 36000)
                
            }        
        })
    ])
    return docs

}

