import { DrizzleChat, DrizzleMessage } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { DeleteIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import RelatedChats from './RelatedChats';
import RelatedContext from './RelatedContext';
type Props = {
    message: DrizzleMessage | any;
    allChats?: DrizzleChat[];
    isLoading: boolean;
    refetch: any;
}

const MessageItem = ({message, allChats, isLoading, refetch}: Props) => {
    let relatedChatIds: string[] | null = null;

    if ((message as DrizzleMessage).relatedChatIds) {
        const relatedChatIdsString = (message as DrizzleMessage).relatedChatIds;
        if (relatedChatIdsString && relatedChatIdsString !== '[null]') {
        relatedChatIds = JSON.parse(relatedChatIdsString);
        }
    }
    
    const deleteMessage = async (message: any) => {
        try {
          await axios.post('/api/delete-message', { message: message });
          refetch();
        } catch (e) {
          console.log(e);
        }
    }

    const getRelatedContext = async (messageId: string) => {
        try {
            const relatedContext = await axios.post(`/api/get-related-data/`, { messageId: messageId });
            console.log(relatedContext);
            return relatedContext;
        } catch (e) {
            console.log(e);
        }
    }

    return (
            <div key={message.id} className={cn('message-item flex sm:text-lg leading-7 content-center', {'sm:text-xl font-bold dark:text-green-500 mt-10': message.role === 'user'}, {'assistant': message.role !== 'user'})}>
                    <div className={cn('flex flex-col w-full')}>
                        <p>
                        <Markdown
                            components={{
                            code(props) {
                                const {children, className, node, ref, ...rest} = props
                                const match = /language-(\w+)/.exec(className || '')
                                return match ? (
                                <SyntaxHighlighter
                                    {...rest}
                                    language={match[1]}
                                    style={dracula}
                                    PreTag="div"
                                >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                                ) : (
                                <code {...rest} className={className}>
                                    {children}
                                </code>
                                )
                            }
                            }}
                        >{message.content}</Markdown>
                        </p>
                        {relatedChatIds && relatedChatIds.length > 0 && allChats && <RelatedChats relatedChatIds={relatedChatIds} allChats={allChats} />}
                        {message.role === 'system' && <RelatedContext messageId={message.id} />}
                        {/*message.pageNumbers && message.pageNumbers.length > 0 && <p className='my-4'>References: {message.pageNumbers.map(n => <span onClick={() => scrollToPage(n)} className="p-1 mx-1 bg-gray-400 text-xs cursor-pointer hover:bg-yellow-400">{n}</span>)}</p>*/}
                    </div>
                    {!isLoading && message.role === 'user' && <DeleteIcon className='delete-icon w-6 h-6 mr-2 mt-0 cursor-pointer' onClick={() => deleteMessage(message)} />}
            </div>
    )
}

export default MessageItem;