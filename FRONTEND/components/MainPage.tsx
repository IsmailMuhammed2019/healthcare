'use client';

import React from 'react';
import RegistrationForm from './RegistrationForm';
import RegistrationSuccess from './RegistrationSuccess';
import LandingPage from './LandingPage';
import { useRegistrationStore } from '../store/registrationStore';

const MainPage: React.FC = () => {
    const { currentStep, data } = useRegistrationStore();

    // Show landing page if step is 0
    if (currentStep === 0) {
        return <LandingPage />;
    }

    // Show success page if registration is complete (step 7 or higher)
    if (currentStep >= 7 || data.registrationComplete) {
        return <RegistrationSuccess />;
    }

    // Show registration form for steps 1-6
    return <RegistrationForm />;
};

export default MainPage;