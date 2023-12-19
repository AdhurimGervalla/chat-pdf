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

    return (
            <div key={message.id} className={cn('message-item flex text-base leading-snug content-center', {'font-bold mt-5 first:mt-0': message.role === 'user'}, {'assistant': message.role !== 'user'})}>
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
                        {message.role === ('assistant' || 'system') && <RelatedContext messageId={message.id} />}
                    </div>
                    {!isLoading && message.role === 'user' && <DeleteIcon className='delete-icon w-5 h-5 mr-2 mt-0 cursor-pointer' onClick={() => deleteMessage(message)} />}
            </div>
    )
}

export default MessageItem;