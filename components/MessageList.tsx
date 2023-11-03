import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import Markdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
    messages: Message[],
}

const MessageList = ({messages}: Props) => {
    
    if (!messages) return <></>;

    return (
    <div className='flex flex-col gap-2 px-4'>
        {messages.map(message => {
            return (
                <div key={message.id} className={cn('flex', {'justify-end pl-10': message.role === 'user'}, {'justify-start pr-10': message.role === 'assistant'})}>
                    <div className={cn('rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900', {'bg-blue-600 text-white': message.role === 'user'})}><p><Markdown
    children={message.content}
    components={{
      code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        console.log(match)
        return match ? (
          <SyntaxHighlighter
            {...rest}
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={dracula}
            PreTag="div"
          />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      }
    }}
  /></p></div>
                </div>
            )
        })}
    </div>
    )
}

export default MessageList;