// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
                <p className="text-gray-600 max-w-md">
                    An error occurred while processing your request. Please try again.
                </p>
                <Button onClick={reset} className="mt-4">
                    Try again
                </Button>
            </div>
        </div>
    )
}