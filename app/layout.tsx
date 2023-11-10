import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from '@/components/Providers'
import {Toaster} from 'react-hot-toast';
import { GeistSans, GeistMono } from 'geist/font'

const inter = Inter({ subsets: ['latin'] })

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
      <Providers>
        <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
          <body className={inter.className}>
            {children}
            <Toaster position='top-center' reverseOrder={false} />
            <Analytics />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  )
}
