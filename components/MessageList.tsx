import { cn } from '@/lib/utils'
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ExtendedMessage } from './ChatComponent'
import { Message } from 'ai/react'

type Props = {
    messages: Message[];
    extendedMessages?: ExtendedMessage[];
}

const MessageList = ({messages}: Props) => {
    
    if (!messages) return <></>;

    console.log('messages', messages)

    const scrollToPage = (pageNumber: number) => {
      const pageElement = document.getElementById(`page_${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
    <div className='flex flex-col gap-2 px-4'>
        {messages.map(message => {
            return (
                <div key={message.id} className={cn('flex', {'justify-end pl-10': message.role === 'user'}, {'justify-start pr-10': message.role === 'assistant'})}>
                    <div className={cn('rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-300', {'bg-blue-600 text-white': message.role === 'user'})}>
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