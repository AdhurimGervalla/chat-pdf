import {PineconeClient} from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'

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
    
    // 3. verctorize the documents
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