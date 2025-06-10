// components/ui/nin-input.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forwardRef } from "react"

interface NINInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const NINInput = forwardRef<HTMLInputElement, NINInputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && <Label htmlFor={props.id}>{label}</Label>}
                <Input
                    ref={ref}
                    type="text"
                    maxLength={11}
                    className={className}
                    placeholder="12345678901"
                    {...props}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <p className="text-xs text-gray-500">Enter your 11-digit National Identification Number</p>
            </div>
        )
    }
)

NINInput.displayName = "NINInput"