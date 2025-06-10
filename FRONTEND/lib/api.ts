import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface RegistrationData {
    firstName: string;
    middleName?: string;
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
    emergencyContactName: string;
    emergencyContactAddress: string;
    emergencyContactPhone: string;
    beneficiary1Name: string;
    beneficiary1Address: string;
    beneficiary1Phone: string;
    beneficiary1Relationship: string;
    beneficiary2Name?: string;
    beneficiary2Address?: string;
    beneficiary2Phone?: string;
    beneficiary2Relationship?: string;
}

export interface UserResponse {
    id: number;
    registration_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth: string;
    sex: string;
    phone_number: string;
    nin: string;
    membership_status: string;
    registration_fee_paid: boolean;
    created_at: string;
}

export interface PaymentData {
    registration_id: string;
    amount: number;
    payment_type: 'registration' | 'daily_dues';
}

export interface QRData {
    registration_id: string;
    name: string;
    phone: string;
    status: string;
    payment_status: {
        registration_fee_paid: boolean;
        daily_dues_balance: number;
    };
    issue_date: string;
    zone: string;
    unit: string;
}

// Transform frontend data to backend format
const transformRegistrationData = (data: any) => {
    return {
        first_name: data.firstName,
        middle_name: data.middleName || undefined,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        sex: data.sex,
        phone_number: data.phoneNumber,
        nin: data.nin,
        address: data.address,
        state: data.state,
        lga: data.lga,
        zone: data.zone,
        unit: data.unit,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_address: data.emergencyContactAddress,
        emergency_contact_phone: data.emergencyContactPhone,
        beneficiary1_name: data.beneficiary1Name,
        beneficiary1_address: data.beneficiary1Address,
        beneficiary1_phone: data.beneficiary1Phone,
        beneficiary1_relationship: data.beneficiary1Relationship,
        beneficiary2_name: data.beneficiary2Name || undefined,
        beneficiary2_address: data.beneficiary2Address || undefined,
        beneficiary2_phone: data.beneficiary2Phone || undefined,
        beneficiary2_relationship: data.beneficiary2Relationship || undefined,
    };
};

// API Functions
export const submitRegistration = async (data: any): Promise<UserResponse> => {
    try {
        const transformedData = transformRegistrationData(data);
        const response = await api.post('/api/register', transformedData);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('Registration failed. Please try again.');
    }
};

export const uploadPhoto = async (registrationId: string, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/api/upload-photo/${registrationId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('Photo upload failed. Please try again.');
    }
};

export const getUser = async (registrationId: string): Promise<UserResponse> => {
    try {
        const response = await api.get(`/api/user/${registrationId}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('User not found.');
    }
};

export const updatePayment = async (paymentData: PaymentData): Promise<any> => {
    try {
        const response = await api.post('/api/payment', paymentData);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('Payment update failed. Please try again.');
    }
};

export const generateCard = async (registrationId: string): Promise<Blob> => {
    try {
        const response = await api.get(`/api/generate-card/${registrationId}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error: any) {
        throw new Error('Card generation failed. Please try again.');
    }
};

export const getQRData = async (registrationId: string): Promise<QRData> => {
    try {
        const response = await api.get(`/api/qr-data/${registrationId}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('QR data not found.');
    }
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
    try {
        const response = await api.get('/api/users');
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('Failed to fetch users.');
    }
};

// Utility function to download the generated card
export const downloadCard = async (registrationId: string, fileName?: string) => {
    try {
        const blob = await generateCard(registrationId);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `registration_card_${registrationId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
};

export default api;