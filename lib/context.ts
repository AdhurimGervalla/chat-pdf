import { Pinecone, RecordMetadata, ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";
import { Metadata } from "./types/types";

/**
 * Gets the matches from a list of embeddings
 * @param embeddings Embeddings to search for
 * @param identifier Pinecone namespace identifier to search in
 * @returns Metadata of the documents that match the embeddings
 */
export async function getMatchesFromEmbeddings(
  embeddings: number[],
  identifier: string
): Promise<ScoredPineconeRecord<RecordMetadata>[]> {
  try {
    const client = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index(process.env.PINECONE_INDEX_NAME!);
    const namespace = pineconeIndex.namespace(identifier);
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

/**
 * Gets the context of a query from a Pinecone namespace
 * @param query Query to search for
 * @param identifier Pinecone namespace identifier to search in
 * @returns Metadata of the documents that match the query
 */
export async function getContext(query: string, identifier: string): Promise<Metadata[]> {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, identifier);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );
  
  let docs: Metadata[] = qualifyingDocs.map((match) => {
    const metadata = (match.metadata as Metadata)
    return {text: metadata.text, pageNumber: metadata.pageNumber, chatId: metadata.chatId, fileId: metadata.fileId};
  });

  return docs;
}