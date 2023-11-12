import React from 'react'
import { db } from '@/lib/db'
import { DrizzleChat, chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Props = {}

const ChatsPage = async (props: Props) => {
  const {userId} = await auth();

  let _chats: DrizzleChat[] = [];
  if (userId) {
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId)); 
  }

    
  return (
    <div className='container mt-10'>
      <h2 className="text-sm font-medium text-gray-500">All Chats</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {_chats && _chats.map((chat: DrizzleChat) => (
          <li key={chat.id} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={cn(
                'bg-blue-600',
                'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
              )}
            >
              AG
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <Link href={'chats/'+chat.id} className="font-medium text-gray-900 hover:text-gray-600">
                  {chat.pdfName}
                </Link>
                <p className="text-gray-500">{chat.fileKey} Members</p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open options</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatsPage;