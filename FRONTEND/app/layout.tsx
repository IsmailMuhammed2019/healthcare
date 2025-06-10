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
                    <nav className="bg-white shadow-sm border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <h1 className="text-xl font-bold text-green-600">
                                            Firstcare Health Partners
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">
                                        Registration Portal
                                    </span>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <main className="py-8">
                        {children}
                    </main>
                    <footer className="bg-white border-t mt-16">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <div className="text-center text-sm text-gray-500">
                                <p>© 2024 Firstcare Health Partners. All rights reserved.</p>
                                <p className="mt-1">
                                    No 6, Yusuf Mohammed street, Narayi Highcost, Barnawa, Kaduna
                                </p>
                                <p className="mt-1">
                                    Email: admin@firstcaregroup.com | Website: www.firstcarepartners.net
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}