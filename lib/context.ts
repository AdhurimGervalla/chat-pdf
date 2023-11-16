import { Pinecone } from "@pinecone-database/pinecone";
import { convertStringToASCII } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  identifier: string
) {
  try {
    const client = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("chat-pdf");
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

export async function getContext(query: string, identifier: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, identifier);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.8
  );

  console.log("qualifyingDocs", qualifyingDocs);

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs: Metadata[] = qualifyingDocs.map((match) => {
    const metadata = (match.metadata as Metadata)
    return {text: metadata.text, pageNumber: metadata.pageNumber};
  });
  // 5 vectors
  return docs;
}