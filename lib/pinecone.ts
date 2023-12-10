import {Pinecone, PineconeRecord} from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertStringToASCII } from './utils';
import { DrizzleMessage } from './db/schema';

export const getPineconeClient = () => {
    return new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  };

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber: number}
    }
}


/**
 * Loads a pdf from s3 into pinecone
 * it will split the pdf into smaller chunks and embed each chunk
 * @param fileKey file key of the pdf in s3
 * @returns documents of the first page
 */
export async function loadS3IntoPinecone(fileKey: string, namespace: string) {
    // 1. optain the pdf from s3 -> download and read from pdf
    const  file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error('Could not download file from s3');
    }
    const loader = new PDFLoader(file_name);
    const pages = await loader.load() as PDFPage[];

    // 2. split and segment the pdf into smaller chunks
    const docs = await Promise.all(
        pages.map(prepareDocuments)
    )
    
    // 3. verctorize and embed individual documents
    const vectors = await Promise.all(
        docs.flat().map((doc) => embedDocuments(doc, fileKey))
    );

    // 4. upload the vectors to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index(process.env.PINECONE_INDEX_NAME!);

    // const ns = pineconeIndex.namespace(convertStringToASCII(fileKey))
    const ns = pineconeIndex.namespace(namespace)
    // await ns.upsert(vectors);

    // Upload vectors in batches of 100
    console.log('vectors', vectors.length);
    for (let i = 0; i < vectors.length; i += 100) {
        const batch = vectors.slice(i, i + 100);
        await ns.upsert(batch);
    }

    return docs[0];
}

export async function loadChatIntoPinecone(messages: DrizzleMessage[], namespace: string, chatId: string) {
    const vectors = await embedMessages(messages, chatId);
    const client = await getPineconeClient();
    const pineconeIndex = await client.index(process.env.PINECONE_INDEX_NAME!);
    const ns = pineconeIndex.namespace(namespace)
    try {
        await ns.upsert(vectors);
    } catch (error) {
        console.log('error upserting message', error);
    }
}

async function embedDocuments(doc: Document, fileKey: string): Promise<PineconeRecord> {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber,
                fileKey
            }
        } as PineconeRecord;
    } catch (error) {
        console.log('error embedDocuments', error);
        throw error;
    }
}

async function embedMessages(messages: DrizzleMessage[], chatId: string): Promise<PineconeRecord[]> {
    try {
        const embeddings = await Promise.all(
            messages.map(message => getEmbeddings(message.content))
        );
        const hashes = messages.map(message => md5(message.content));

        return hashes.map((hash, index) => {
            return {
                id: hash,
                values: embeddings[index],
                metadata: {
                    text: messages[index].content,
                    chatId
                }
            } as PineconeRecord;
        });
    } catch (error) {
        console.log('error embedMessages', error);
        throw error;
    }
}

export const truncateStringByBytes = (str: string, numBytes: number) => {
    const encoder = new TextEncoder();
    return new TextDecoder('utf-8').decode(
        encoder.encode(str).slice(0, numBytes)
    );
}

async function prepareDocuments(page: PDFPage) {
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/\n/g, ''); // remove newlines    
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000) // 36k bytes are 12k characters
            }
        })
    ]);

    return docs;
}

export async function deletePineconeIndex(namespace: string, chatId: string): Promise<void> {
    const client = await getPineconeClient();
    await client.index(process.env.PINECONE_INDEX_NAME!).namespace(namespace).deleteMany({ chatId: chatId });

}

/**
 * Delete all vectors from pinecone index for a given file
 * @param namespace namespace of the index
 * @param fileKey file key of the file to delete
 */
export async function deletePineconeIndexFromFile(namespace: string, fileKey: string): Promise<void> {
    const client = await getPineconeClient();
    await client.index(process.env.PINECONE_INDEX_NAME!).namespace(namespace).deleteMany({ fileKey });
}

export async function deletePineconeNamespace(namespace: string): Promise<void> {
    const client = await getPineconeClient();
    await client.index(process.env.PINECONE_INDEX_NAME!).namespace(namespace).deleteAll();
}