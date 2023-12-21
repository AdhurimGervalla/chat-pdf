import { OpenAIApi, Configuration } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getContext } from '@/lib/context';
import { db } from "@/lib/db";
import { chats, messages as _messages, messagesToFiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { Message } from 'ai/react';
import { checkSubscription } from '@/lib/subscription';
import { getNamespaceForWorkspace, languages } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { v4 } from "uuid";
import { getOpenAiApi } from '@/lib/openai';
import { Metadata, PageNumberObject, RelatedData } from '@/lib/types/types';

export const runtime = 'edge';


const openai = getOpenAiApi();

export async function POST(req: NextRequest) {
    try {
        let { messages, chatId, chatLanguage, currentWorkspace } = await req.json();
        const { userId } = await auth();

        if (!chatId || !userId) {
            return NextResponse.json({ 'error': 'messages or chatId not provided' }, { status: 400 })
        }

        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

        if (_chats.length === 0) {
            await db
                .insert(chats)
                .values({
                    id: chatId,
                    userId,
                    title: messages[0].content.substring(0, 40).replace(/'/g, "''"),
                });
        }

        const isPro = await checkSubscription();
        const lastMessage = messages[messages.length - 1];

        let pageNumbers: number[] = [];
        let prompt = {
            role: "system",
            content: getContextBlock("", chatLanguage as LanguageCodes)
        };

        // object with relatedChatIds, pageNumbers and fileId
        let relatedObject: RelatedData =
        {
            relatedChatIds: [],
            pageNumbers: [],
            fileIds: [],
            context: ""
        };
        // if file is uploaded
        if (currentWorkspace) {
            if (userId) {
                const contextMetadata = await getContext(lastMessage.content, getNamespaceForWorkspace(currentWorkspace.identifier, currentWorkspace.owner));
                relatedObject = extractRelatedObject(contextMetadata);
                prompt = {
                    role: "system",
                    content: getContextBlock(relatedObject.context, chatLanguage as LanguageCodes)
                };
            }
        }

        // const model = isPro || userId === 'user_2Y05V0SAZMX7yxWRHFCiwMxCGog' ? 'gpt-4-1106-preview' : 'gpt-3.5-turbo';
        const model = 'gpt-4';
        const response = await openai.createChatCompletion({
            model,
            messages: [
                //prompt, ...messages.filter((message: Message) => message.role === 'user')
                prompt, ...messages // all previous messages should be added to the prompt for better results
            ],
            stream: true,
        });

        const userQuestionMessageId = v4();

        const stream = OpenAIStream(response, {
            onStart: async () => {
                // save usermessage to db
                await db.insert(_messages).values({
                    id: userQuestionMessageId,
                    chatId,
                    content: lastMessage.content,
                    role: 'user'
                })

            },
            onCompletion: async (completion) => {
                const id = v4();
                // save ai message to db
                await db.insert(_messages).values({
                    id,
                    chatId,
                    content: completion,
                    role: 'assistant', // todo: check if this is correct. should be system or assistant?
                    originId: userQuestionMessageId,
                    relatedChatIds: JSON.stringify(relatedObject.relatedChatIds)
                });

                for (let i = 0; i < relatedObject.pageNumbers.length; i++) {
                    const fileId: string = Object.keys(relatedObject.pageNumbers[i])[0];
                    const fileIdNumber = parseInt(fileId);
                    const pageNumbers = relatedObject.pageNumbers[i][fileIdNumber];
                    await db.insert(messagesToFiles).values({
                        messageId: id,
                        fileId: fileIdNumber,
                        pageNumbers: JSON.stringify(pageNumbers),
                    });
                }
            }
        });

        return new StreamingTextResponse(stream);
    } catch (error) {
        return NextResponse.json({ 'error': 'something went wrong' }, { status: 500 })
    }
}


interface ITranslations {
    intro: string;
    traits: string;
    behavior: string;
    demeanor: string;
    knowledge: string;
    startContext: string;
    endContext: string;
    contextUsage: string;
    unknownAnswer: string;
    nonApology: string;
    invention: string;
}

type LanguageCodes = typeof languages[number];
type TranslationsType = Record<LanguageCodes, ITranslations>;

const translations: TranslationsType = {
    en: {
        intro: `AI assistant is a brand new, powerful, human-like artificial intelligence.`,
        traits: `The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.`,
        behavior: `AI is a well-behaved and well-mannered individual.`,
        demeanor: `AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
        knowledge: `AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.`,
        startContext: `START CONTEXT BLOCK`,
        endContext: `END OF CONTEXT BLOCK`,
        contextUsage: `AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.`,
        unknownAnswer: `If the context does not provide the answer to a question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".`,
        nonApology: `AI assistant will not apologize for previous responses, but instead will indicate new information was gained.`,
        invention: `AI assistant will not invent anything that is not drawn directly from the context.`
    },
    de: {
        intro: `Der KI-Assistent ist eine brandneue, leistungsstarke, menschenähnliche künstliche Intelligenz.`,
        traits: `Zu den Eigenschaften der KI gehören Fachwissen, Hilfsbereitschaft, Klugheit und Ausdrucksfähigkeit.`,
        behavior: `Der KI-Assistent ist ein wohlerzogenes und gut manieriertes Individuum.`,
        demeanor: `Der KI-Assistent ist immer freundlich, nett und inspirierend und er ist bestrebt, dem Benutzer lebendige und durchdachte Antworten zu geben.`,
        knowledge: `Die KI verfügt über die Gesamtheit allen Wissens in ihrem Gehirn und ist in der Lage, nahezu jede Frage zu jedem Thema im Gespräch genau zu beantworten.`,
        startContext: `START CONTEXT BLOCK`,
        endContext: `END OF CONTEXT BLOCK`,
        contextUsage: `Der KI-Assistent wird jeden KONTEXTBLOCK berücksichtigen, der in einem Gespräch gegeben wird.`,
        unknownAnswer: `Wenn der Kontext nicht die Antwort auf eine Frage liefert, wird der KI-Assistent sagen: "Es tut mir leid, aber ich kenne die Antwort auf diese Frage nicht".`,
        nonApology: `Der KI-Assistent wird sich nicht für vorherige Antworten entschuldigen, sondern stattdessen angeben, dass neue Informationen gewonnen wurden.`,
        invention: `Der KI-Assistent wird nichts erfinden, was nicht direkt aus dem Kontext gezogen wird.`
    },
}

/**
 * Returns the context block for the given language
 * @param context Context block
 * @param lang 
 * @returns 
 */
const getContextBlock = (context: string, lang: LanguageCodes = 'en') => {
    const t = translations[lang] || translations.en; // Fallback to English if the language is not found

    if (context === "") return `${t.intro}
        ${t.traits}
        ${t.behavior}
        ${t.demeanor}
        ${t.knowledge}
        ${t.nonApology}
        `;

    return `${t.intro}
      ${t.traits}
      ${t.behavior}
      ${t.demeanor}
      ${t.knowledge}
      ${t.startContext}
      ${context}
      ${t.endContext}
      ${t.contextUsage}
      ${t.unknownAnswer}
      ${t.nonApology}
      ${t.invention}
      `;
}

function extractRelatedObject(metadata: Metadata[]): RelatedData {
    const context = metadata.map(doc => doc.text).join("\n").substring(0, 16000);
    let relatedChatIds = metadata.map(doc => doc.chatId).filter((chatId): chatId is string => chatId !== undefined);
    relatedChatIds = removeDuplicates(relatedChatIds);

    let pageNumbersObjects: PageNumberObject[] = [];

    for (const doc of metadata) {
        if (doc.pageNumber && doc.fileId) {
            const pageNumberObject = pageNumbersObjects.find(pageNumberObject => pageNumberObject[doc.fileId as number]);
            if (pageNumberObject) {
                pageNumberObject[doc.fileId as number].push(doc.pageNumber);
            } else {
                const newPageNumberObject: PageNumberObject = {};
                newPageNumberObject[doc.fileId as number] = [doc.pageNumber];
                pageNumbersObjects.push(newPageNumberObject);
            }
        }
    }

    let fileIds = metadata.map(doc => doc.fileId).filter((fileId): fileId is number => fileId !== undefined);
    fileIds = removeDuplicates(fileIds);

    return {
        relatedChatIds,
        pageNumbers: pageNumbersObjects,
        fileIds,
        context
    }
}

function removeDuplicates<T>(arr: T[]) {
    return [...new Set(arr)];
}