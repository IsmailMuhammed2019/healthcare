// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Shield } from 'lucide-react'

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
                {/* Navigation */}
                <nav className="relative z-10 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Firstcare</h1>
                                <p className="text-xs text-gray-600">Health Partners</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
                            <a href="#about" className="text-gray-600 hover:text-emerald-600 transition-colors">About</a>
                            <a href="#contact" className="text-gray-600 hover:text-emerald-600 transition-colors">Contact</a>
                        </div>
                    </div>
                </nav>
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

                    {children}
                </div>
                {/* Footer */}
                <footer className="bg-gray-900 text-white px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Firstcare Health Partners</h3>
                                        <p className="text-gray-400 text-sm">Quality Healthcare</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 max-w-md">
                                    No 6, Yusuf Mohammed street, Narayi Highcost, Barnawa, Kaduna, Kaduna state.
                                </p>
                                <p className="text-gray-300 mt-2">admin@firstcaregroup.com</p>
                                <p className="text-gray-300">www.firstcarepartners.net</p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Services</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>Healthcare Coverage</li>
                                    <li>Welfare Advisory</li>
                                    <li>Insurance Products</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Coverage Areas</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>Zaria Region</li>
                                    <li>Kaduna Region</li>
                                    <li>Kafanchan Region</li>
                                    <li>23 Local Government Areas</li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 Firstcare Health Partners. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    )
}