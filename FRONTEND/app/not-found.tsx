// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-800">404</h2>
                <h3 className="text-xl font-semibold text-gray-600">Page Not Found</h3>
                <p className="text-gray-500 max-w-md">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    )
}