// lib/constants.ts
export const CONSTANTS = {
    REGISTRATION_FEE: 6000,
    DAILY_DUES: 200,
    WORKING_DAYS_PER_WEEK: 6,

    PAYMENT_TYPES: {
        REGISTRATION: 'registration',
        DAILY_DUES: 'daily_dues'
    } as const,

    MEMBERSHIP_STATUS: {
        ACTIVE: 'active',
        PENDING: 'pending',
        SUSPENDED: 'suspended'
    } as const,

    SEX_OPTIONS: [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' }
    ],

    ZONES: [
        'Zaria Region',
        'Kaduna Region',
        'Kafanchan Region'
    ],

    LGAS: [
        'Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba',
        'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko',
        'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere',
        'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'
    ],

    RELATIONSHIPS: [
        'Spouse', 'Parent', 'Child', 'Sibling', 'Relative', 'Friend', 'Other'
    ]
}