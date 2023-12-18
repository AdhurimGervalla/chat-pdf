import React, { memo } from 'react'
import ChatInputComponent from './ChatInputComponent';

type Props = {
    handleSubmit: any;
    stop: any;
    input: string;
    isLoading: boolean;
    handleInputChange: any;
}

const ChatForm = ({handleSubmit, handleInputChange, isLoading, input}: Props) => {
    console.log('ChatForm rerender');

    return (
        <form onSubmit={handleSubmit} className={"sticky bottom-0 inset-x-0 pt-10 pb-5 w-full max-w-4xl mx-auto mt-auto"}>
            <div className="flex">
            <ChatInputComponent handleSubmit={handleSubmit} stopCb={stop} value={input} 
                isLoading={isLoading} onChange={handleInputChange} placeholder={'How can i help you?'} />
            </div>
        </form>
    );
}

export default memo(ChatForm);