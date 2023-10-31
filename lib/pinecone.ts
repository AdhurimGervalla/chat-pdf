import {PineconeClient, PineconeRecord, utils as PineconeUtils} from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertStringToASCII } from './utils';

let pinecone: PineconeClient | null = null
export const getPinecone = async () => {
    if (!pinecone) {
        pinecone = new PineconeClient();
        await pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }
    return pinecone
}

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
export async function loadS3IntoPinecone(fileKey: string) {
    // 1. optain the pdf from s3 -> download and read from pdf
    console.log('downloading from s3 ...');
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
        docs.flat().map(embedDocuments)
    );

    // 4. upload the vectors to pinecone
    const client = await getPinecone();
    const pineconeIndex = client.Index('chatpdf');

    console.log('inserting vectors into pinecode ...');

    const namespace = convertStringToASCII(fileKey);
    PineconeUtils.chunkedUpsert(pineconeIndex, vectors, "", 10);

    return docs[0];
}

async function embedDocuments(doc: Document): Promise<PineconeRecord> {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as PineconeRecord;
    } catch (error) {
        console.log('error embedDocuments', error);
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
    pageContent = pageContent.replace(/\n/g, '');    
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ]);

    return docs;
}