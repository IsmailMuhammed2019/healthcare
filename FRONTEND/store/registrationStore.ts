import { create } from 'zustand';

export interface RegistrationData {
    // Personal Information
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    sex: string;
    phoneNumber: string;
    nin: string;
    address: string;
    state: string;
    lga: string;
    zone: string;
    unit: string;

    // Photo
    photo: File | null;
    photoPreview: string;

    // Emergency Contact
    emergencyContactName: string;
    emergencyContactAddress: string;
    emergencyContactPhone: string;

    // Beneficiaries
    beneficiary1Name: string;
    beneficiary1Address: string;
    beneficiary1Phone: string;
    beneficiary1Relationship: string;
    beneficiary2Name: string;
    beneficiary2Address: string;
    beneficiary2Phone: string;
    beneficiary2Relationship: string;

    // Registration Details
    registrationId?: string;
    registrationComplete: boolean;
    paymentComplete: boolean;
}

interface RegistrationStore {
    currentStep: number;
    data: RegistrationData;
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentStep: (step: number) => void;
    updateData: (data: Partial<RegistrationData>) => void;
    setPhoto: (file: File, preview: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetForm: () => void;
    nextStep: () => void;
    prevStep: () => void;
}

const initialData: RegistrationData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    phoneNumber: '',
    nin: '',
    address: '',
    state: 'Kaduna',
    lga: '',
    zone: '',
    unit: '',
    photo: null,
    photoPreview: '',
    emergencyContactName: '',
    emergencyContactAddress: '',
    emergencyContactPhone: '',
    beneficiary1Name: '',
    beneficiary1Address: '',
    beneficiary1Phone: '',
    beneficiary1Relationship: '',
    beneficiary2Name: '',
    beneficiary2Address: '',
    beneficiary2Phone: '',
    beneficiary2Relationship: '',
    registrationComplete: false,
    paymentComplete: false,
};

export const useRegistrationStore = create<RegistrationStore>((set, get) => ({
    currentStep: 1,
    data: initialData,
    isLoading: false,
    error: null,

    setCurrentStep: (step) => set({ currentStep: step }),

    updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
    })),

    setPhoto: (file, preview) => set((state) => ({
        data: { ...state.data, photo: file, photoPreview: preview }
    })),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    resetForm: () => set({
        currentStep: 1,
        data: initialData,
        isLoading: false,
        error: null,
    }),

    nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 6)
    })),

    prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
    })),
}));

// Constants
export const KADUNA_ZONES = [
    'Zaria Region',
    'Kaduna Region',
    'Kafanchan Region'
];

export const KADUNA_LGAS = [
    'Birnin Gwari',
    'Chikun',
    'Giwa',
    'Igabi',
    'Ikara',
    'Jaba',
    'Jema\'a',
    'Kachia',
    'Kaduna North',
    'Kaduna South',
    'Kagarko',
    'Kajuru',
    'Kaura',
    'Kauru',
    'Kubau',
    'Kudan',
    'Lere',
    'Makarfi',
    'Sabon Gari',
    'Sanga',
    'Soba',
    'Zangon Kataf',
    'Zaria'
];

export const RELATIONSHIPS = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Relative',
    'Friend',
    'Other'
];