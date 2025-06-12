// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Firstcare Health Partners - Registration',
    description: 'Member registration system for Firstcare Health Partners',
    keywords: 'health insurance, registration, Nigeria, Kaduna',
    authors: [{ name: 'Firstcare Health Partners' }],
    viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                    {children}
                </div>
            </body>
        </html>
    )
}