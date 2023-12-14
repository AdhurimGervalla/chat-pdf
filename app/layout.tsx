import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from '@/components/Providers'
import {Toaster} from 'react-hot-toast';
import { GeistSans, GeistMono } from 'geist/font'
import WorkspaceContextProvider from '@/context/WorkspaceContextProvider';


export const metadata: Metadata = {
  title: 'workspAIces',
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
          <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <head>
              <meta name="application-name" content="workspAIces App" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="default" />
              <meta name="apple-mobile-web-app-title" content="workspAIces App" />
              <meta name="description" content="Chat within your own context" />
              <meta name="format-detection" content="telephone=no" />
              <meta name="mobile-web-app-capable" content="yes" />
              <meta name="msapplication-config" content="/icons/browserconfig.xml" />
              <meta name="msapplication-TileColor" content="#ffffff" />
              <meta name="msapplication-tap-highlight" content="no" />
              <meta name="theme-color" content="#ffffff" />
              <meta
                name='viewport'
                content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
              />
              <link rel="manifest" href="/manifest.json"/>
              <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
              <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
              <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
              <link rel="manifest" href="/icons/site.webmanifest"/>
            </head>

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
