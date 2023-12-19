import React, { useEffect, useRef } from 'react'
import { Loader2, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
import { WorkspaceContext } from '@/context/WorkspaceContext';

type Props = {
  stopCb: any;
  onChange: any;
  placeholder: string;
  isLoading: boolean;
  value: string;
  handleSubmit: any;
}

export default function ChatInputComponent({stopCb, onChange, placeholder, isLoading, value, handleSubmit}: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const {workspace} = React.useContext(WorkspaceContext);
  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Verhindert den Zeilenumbruch
      // submit the form from here
      handleSubmit(event);
    }
  };
  useEffect(resizeTextArea, [value]);

  return (
    <div className="flex items-start space-x-4 w-full ">
      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className="bg-white dark:bg-black overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-300">
            <textarea
            aria-multiline="true"
            onChange={onChange}
            value={value}
            ref={textAreaRef}
            onKeyPress={handleKeyPress}
              rows={2}
              name="chat-textarea"
              id="chat-textarea"
              className="block w-full resize-none border-0 bg-transparent py-1.5 focus:ring-0 sm:text-lg sm:leading-6"
              placeholder={placeholder}
            />
            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between items-center py-2 pl-3 pr-2">
            <div>
              <p className="text-sm leading-5 text-gray-500 dark:text-gray-400">
                {workspace?.name}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button type='submit' onClick={() => {
                  if (isLoading) {
                    stopCb(); // TODO: stopCb not triggering
                  }
                }}>{isLoading ? <><Loader2 className='w-4 h-4 animate-spin mr-1' /> <span>Stop</span></> : <><SendIcon className='w-4 h-4 mr-1' /><span>Send</span></>}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}