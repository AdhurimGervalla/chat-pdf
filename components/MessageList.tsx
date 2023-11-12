import { cn } from '@/lib/utils'
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ExtendedMessage } from './ChatComponent'
import { Message } from 'ai/react'

type Props = {
    messages: Message[];
}

const MessageList = ({messages}: Props) => {
    
    if (!messages) return <></>;
    
    const scrollToPage = (pageNumber: number) => {
      const pageElement = document.getElementById(`page_${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
    <div className='flex flex-col gap-3'>
        {messages.map(message => {
            return (
                <div key={message.id} className={cn('message-item flex text-lg leading-7', {'text-xl font-bold [&:not(:first-child)]:mt-10': message.role === 'user'})}>
                    <div className={cn('flex flex-col')}>
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
                      {/*message.pageNumbers && message.pageNumbers.length > 0 && <p className='my-4'>References: {message.pageNumbers.map(n => <span onClick={() => scrollToPage(n)} className="p-1 mx-1 bg-gray-400 text-xs cursor-pointer hover:bg-yellow-400">{n}</span>)}</p>*/}
                    </div>
                </div>
            )
        })}
    </div>
    )
}

export default MessageList;