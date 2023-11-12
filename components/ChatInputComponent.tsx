/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { UserButton } from '@clerk/nextjs'
import {
  PaperClipIcon,
} from '@heroicons/react/20/solid'
import { Loader2 } from 'lucide-react'


export default function ChatInputComponent({onChange, placeholder, isLoading, value, isPro}:{onChange: any, placeholder: string, isLoading: boolean, value: string, isPro: boolean}) {

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
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 focus:ring-0 sm:text-lg sm:leading-6"
              placeholder={placeholder}
              defaultValue={''}
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
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Attach a file</span>
                </button>
                <p className='flex ml-3 text-xs text-center'>{isPro ? 'GPT-4' : 'GPT-3.5-turbo'}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                className="inline-flex items-center rounded-md bg-green-500  hover:bg-green-600 dark:hover:bg-green-600 transition-all px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}