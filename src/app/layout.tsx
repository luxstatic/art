import React, { type PropsWithChildren } from 'react'
import type { Metadata, Viewport } from 'next'

import siteDef from '../site-def'
import _metadata from '../metadata'
import './globals.css'

export const metadata: Metadata = { ..._metadata }

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-black">
      <body className="min-h-screen bg-black m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  )
}
