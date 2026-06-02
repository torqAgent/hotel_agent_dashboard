import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Torq Agents — Dashboard',
  description: 'AI Reception Intelligence for Hotels',
  icons: { icon: '/logo.jpeg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" />
      </head>
      <body>
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
