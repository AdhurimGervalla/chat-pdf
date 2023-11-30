import { cn } from '@/lib/utils'
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from 'ai/react'
import { DeleteIcon } from 'lucide-react'
import axios from 'axios'
import { DrizzleChat, DrizzleMessage } from '@/lib/db/schema'
import Link from 'next/link'

type Props = {
    messages: Message[] | DrizzleMessage[];
    refetch: any;
    isLoading: boolean;
    allChats?: DrizzleChat[];
}

const MessageList = ({messages, refetch, isLoading = false, allChats}: Props) => {

    if (!messages) return <></>;
    
    const scrollToPage = (pageNumber: number) => {
      const pageElement = document.getElementById(`page_${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const deleteMessage = async (message: Message) => {
      try {
        await axios.post('/api/delete-message', { message: message });
        refetch();
      } catch (e) {
        console.log(e);
      }
    }

    return (
    <div className='flex flex-col gap-3'>
        {messages.map((message, index) => {
          let relatedChatIds: string[] | null = null;
          if ((message as DrizzleMessage).relatedChatIds) {
            const relatedChatIdsString = (message as DrizzleMessage).relatedChatIds;
            if (relatedChatIdsString && relatedChatIdsString !== '[null]') {
              relatedChatIds = JSON.parse(relatedChatIdsString);
            }
          }
          
            return (
                <div key={message.id} className={cn('message-item flex text-lg leading-7 content-center', {'text-xl font-bold dark:text-green-500 mt-10': message.role === 'user'}, {'assistant': message.role !== 'user'})}>
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
                      {relatedChatIds && relatedChatIds.length > 0 && <p className='my-4 bg-slate-800 px-3 py-1'>Related Chats: {relatedChatIds.map((id, index) => {
                        if (id) {
                          let chatTitle = 'Chat ' + (index+1);
                          if (allChats) {
                            const chat = allChats.find(c => c.id === id);
                            if (chat && chat.title) {
                              chatTitle = chat.title;
                            }
                          }
                          return (
                            <Link key={id} className='mr-5 hover:text-green-500 transition-colors' href={`/chats/${id}`}>{chatTitle}</Link>
                          )
                        }
                      })}</p>}
                      {/*message.pageNumbers && message.pageNumbers.length > 0 && <p className='my-4'>References: {message.pageNumbers.map(n => <span onClick={() => scrollToPage(n)} className="p-1 mx-1 bg-gray-400 text-xs cursor-pointer hover:bg-yellow-400">{n}</span>)}</p>*/}
                    </div>
                    {((!isLoading || (messages.length -1 && messages.length -2) !== index)) && message.role === 'user' && <DeleteIcon className='delete-icon w-6 h-6 mr-2 mt-0 cursor-pointer' onClick={() => deleteMessage(message)} />}
                </div>
            )
        })}
    </div>
    )
}

export default MessageList;