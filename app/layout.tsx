import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from '@/components/Providers'
import {Toaster} from 'react-hot-toast';
import { GeistSans, GeistMono } from 'geist/font'
import WorkspaceContextProvider from '@/context/WorkspaceContextProvider';


export const metadata: Metadata = {
  title: 'PDF2chat',
  description: 'Optimize your interaction with AI by leveraging the context of your own documents.',
  abstract: 'PDF2Chat is a service that enables you to pose AI questions within the context of a PDF.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <WorkspaceContextProvider>
        <Providers>
          <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
            <body className='dark:bg-black dark:text-white'>
              {children}
              <Toaster position='top-center' reverseOrder={false} />
              <Analytics />
            </body>
          </html>
        </Providers>
      </WorkspaceContextProvider>
    </ClerkProvider>
  )
}
