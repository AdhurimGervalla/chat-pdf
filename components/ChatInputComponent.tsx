import { UserButton } from '@clerk/nextjs'
import {
  PaperClipIcon,
} from '@heroicons/react/20/solid'
import axios from 'axios';
import { Loader2, PlusCircle, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
type Props = {
  stopCb: any;
  onChange: any;
  placeholder: string;
  isLoading: boolean;
  value: string;
  isPro: boolean;
}

export default function ChatInputComponent({stopCb, onChange, placeholder, isLoading, value, isPro}: Props) {

  const addToWorkspace = async (chatId: string) => {
    try {
      await axios.post(`/api/add-to-workspace`, {
        chatId
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-start space-x-4 w-full ">
        <div className="flex-shrink-0 opacity-40 hover:opacity-100 transition-all">
          <UserButton afterSignOutUrl='/' />
        </div>
      <div className="min-w-0 flex-1">
        <div className="relative">
          <div className="bg-white dark:bg-black overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-300">
            <textarea
            onChange={onChange}
            value={value}
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

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <p className='flex text-xs text-center'>{isPro ? 'GPT-4' : 'GPT-3.5-turbo'}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={() => {
                  if (isLoading) {
                    stopCb();
                  }
                }}>{isLoading ? <><Loader2 className='w-4 h-4 animate-spin mr-1' /> <span>Stop</span></> : <><SendIcon className='w-4 h-4 mr-1' /><span>Send</span></>}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}