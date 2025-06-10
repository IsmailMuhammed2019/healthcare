// components/ui/success-message.tsx
import { CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface SuccessMessageProps {
    message: string
    className?: string
}

export function SuccessMessage({ message, className }: SuccessMessageProps) {
    return (
        <Alert className={cn("border-green-200 bg-green-50 text-green-800", className)}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}
