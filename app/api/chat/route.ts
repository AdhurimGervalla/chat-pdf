import {OpenAIApi, Configuration} from 'openai-edge';
import {OpenAIStream, StreamingTextResponse} from 'ai';
import { getContext } from '@/lib/context';
import { db } from "@/lib/db";
import { chats, messages as _messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { Message } from 'ai/react';
import { checkSubscription } from '@/lib/subscription';
import { languages } from '@/lib/utils';
import { auth } from '@clerk/nextjs';

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);


export async function POST(req: NextRequest) {
    try {
        let {messages, chatId, chatLanguage} = await req.json();
        if (!chatId) {
            return NextResponse.json({'error': 'messages or chatId not provided'}, {status: 400})
        }
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
        if (_chats.length === 0) {
            // chat doesn't exist
            const {userId} = await auth();
            if (userId === null) {
                // Fügen Sie hier Ihren Code ein, um mit dem Fall umzugehen, dass userId null ist
                return NextResponse.json({error: "unauthorized"}, {status: 401});
            }

            await db
            .insert(chats)
            .values({
                id: chatId,
                userId,
                title: messages[0].content
            });
        }
        
        const isPro = await checkSubscription();
        const fileKey = _chats[0]?.fileKey;
        const lastMessage = messages[messages.length - 1];

        let pageNumbers: number[] = [];
        let prompt = {
            role: "system",
            content: getContextBlock("", chatLanguage as LanguageCodes)
        };
        // if file is uploaded
        if (fileKey) {
            const contextMetadata = await getContext(lastMessage.content, fileKey);
            const context = contextMetadata.map(doc => doc.text).join("\n").substring(0, isPro ? 7000 : 3000);
            pageNumbers = contextMetadata.map(item => item.pageNumber);
            // check if chatLanguage is type of LanguageCodes
            prompt = {
                role: "system",
                content: getContextBlock(context, chatLanguage as LanguageCodes)
            };
        }
    
        const model = isPro ? 'gpt-4' : 'gpt-3.5-turbo';
        const response = await openai.createChatCompletion({
            model,
            messages: [
                prompt, ...messages.filter((message: Message) => message.role === 'user')
            ],
            stream: true,
        });

        const stream = OpenAIStream(response, {
            onStart: async () => {
                // save usermessage to db
                await db.insert(_messages).values({
                    chatId,
                    content: lastMessage.content,
                    role: 'user'
                })

            },
            onCompletion: async (completion) => {
                // save ai message to db
                await db.insert(_messages).values({
                    chatId,
                    content: completion,
                    role: 'system',
                    pageNumbers: JSON.stringify(pageNumbers)
                })
            }
        });

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log(error);
        return NextResponse.json({'error': 'something went wrong'}, {status: 500})
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