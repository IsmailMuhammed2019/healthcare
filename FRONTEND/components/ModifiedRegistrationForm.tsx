// frontend/components/ModifiedRegistrationForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AgentCodeInput } from './AgentCodeInput';
import { useRegistrationStore } from '@/store/registrationStore';

// Import your existing RegistrationForm components
import RegistrationForm from './RegistrationForm';

const agentCodeSchema = z.object({
    agent_code: z.string().min(6, 'Agent code must be at least 6 characters'),
});

type AgentCodeData = z.infer<typeof agentCodeSchema>;

interface AgentInfo {
    agent_name: string;
    zone: string;
    lga: string;
}

export const ModifiedRegistrationForm: React.FC = () => {
    const { currentStep, data, updateData, setCurrentStep } = useRegistrationStore();
    const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
    const [agentValidated, setAgentValidated] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AgentCodeData>({
        resolver: zodResolver(agentCodeSchema),
    });

    const agentCode = watch('agent_code', '');

    const handleAgentValidation = (info: AgentInfo) => {
        setAgentInfo(info);
        setAgentValidated(true);
        updateData({
            agent_code: agentCode,
            zone: info.zone,
            lga: info.lga
        });
    };

    const handleContinueToRegistration = () => {
        if (agentValidated && agentInfo) {
            setCurrentStep(1); // Move to first step of normal registration
        }
    };

    const handleBackToAgentCode = () => {
        setCurrentStep(0); // Back to agent code step
    };

    // Step 0: Agent Code Validation
    if (currentStep === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        Firstcare Health Partners Registration
                    </h1>
                    <p className="text-gray-600">
                        Enter your agent code to begin registration
                    </p>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle>Agent Verification</CardTitle>
                        <CardDescription>
                            You need a valid agent code to register with Firstcare Health Partners
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(() => { })} className="space-y-6">
                            <AgentCodeInput
                                value={agentCode}
                                onChange={(value) => setValue('agent_code', value)}
                                onValidAgent={handleAgentValidation}
                                error={errors.agent_code?.message}
                            />

                            <div className="flex justify-between">
                                <div></div> {/* Empty space for alignment */}
                                <Button
                                    type="button"
                                    onClick={handleContinueToRegistration}
                                    disabled={!agentValidated}
                                    className="min-w-[140px]"
                                >
                                    Continue Registration
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>

                        <div className="text-center pt-4 border-t">
                            <p className="text-sm text-gray-600 mb-2">Don't have an agent code?</p>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>📧 Contact: admin@firstcaregroup.com</p>
                                <p>🏢 Visit any Firstcare Health Partners office</p>
                                <p>📞 Call our customer service line</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Steps 1-6: Modified registration form with agent info
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Firstcare Health Partners Registration
                        </h1>
                        <p className="text-gray-600">
                            Complete your membership registration
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackToAgentCode}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Change Agent
                    </Button>
                </div>

                {/* Agent Info Bar */}
                {agentInfo && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-green-800">
                                    Registering under: {agentInfo.agent_name}
                                </p>
                                <p className="text-sm text-green-600">
                                    Code: {data.agent_code} • Zone: {agentInfo.zone}
                                </p>
                            </div>
                            <div className="text-green-600">
                                <User className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                    <Progress value={(currentStep / 6) * 100} className="mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                        Step {currentStep} of 6
                    </p>
                </div>
            </div>

            {/* Use existing RegistrationForm but with modified data */}
            <RegistrationForm />
        </div>
    );
};
