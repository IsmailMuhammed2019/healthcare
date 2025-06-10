// lib/validation.ts
export const validationRules = {
    nin: {
        required: "NIN is required",
        pattern: {
            value: /^\d{11}$/,
            message: "NIN must be exactly 11 digits"
        }
    },
    phone: {
        required: "Phone number is required",
        pattern: {
            value: /^[0-9]{10,11}$/,
            message: "Phone number must be 10-11 digits"
        }
    },
    name: {
        required: "This field is required",
        minLength: {
            value: 2,
            message: "Must be at least 2 characters"
        },
        pattern: {
            value: /^[a-zA-Z\s'-]+$/,
            message: "Only letters, spaces, hyphens and apostrophes allowed"
        }
    },
    email: {
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
        }
    }
}