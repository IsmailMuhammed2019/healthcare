// components/ui/phone-input.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && <Label htmlFor={props.id}>{label}</Label>}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        +234
                    </div>
                    <Input
                        ref={ref}
                        type="tel"
                        className={cn("pl-12", className)}
                        placeholder="8012345678"
                        {...props}
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        )
    }
)

PhoneInput.displayName = "PhoneInput"