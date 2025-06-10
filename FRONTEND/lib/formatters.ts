// lib/formatters.ts
export const formatters = {
    phone: (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '')

        // Format as Nigerian phone number
        if (digits.startsWith('234')) {
            return digits.slice(3)
        }
        if (digits.startsWith('0')) {
            return digits.slice(1)
        }
        return digits
    },

    nin: (value: string) => {
        // Remove non-digits and limit to 11
        return value.replace(/\D/g, '').slice(0, 11)
    },

    name: (value: string) => {
        // Capitalize first letter of each word
        return value.replace(/\b\w/g, l => l.toUpperCase())
    },

    currency: (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount)
    },

    date: (date: string | Date) => {
        return new Intl.DateTimeFormat('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date))
    }
}