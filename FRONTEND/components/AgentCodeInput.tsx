// frontend/components/AgentCodeInput.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AgentInfo {
    agent_name: string;
    zone: string;
    lga: string;
}

interface AgentCodeInputProps {
    value: string;
    onChange: (value: string) => void;
    onValidAgent: (agentInfo: AgentInfo) => void;
    error?: string;
}

export const AgentCodeInput: React.FC<AgentCodeInputProps> = ({
    value,
    onChange,
    onValidAgent,
    error
}) => {
    const [isValidating, setIsValidating] = useState(false);
    const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateAgentCode = async (code: string) => {
        if (!code || code.length < 6) {
            setAgentInfo(null);
            setValidationError(null);
            return;
        }

        try {
            setIsValidating(true);
            setValidationError(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_AGENT_API_URL}/api/validate-agent-code/${code}`);

            if (!response.ok) {
                throw new Error('Invalid agent code');
            }

            const data = await response.json();
            const info: AgentInfo = {
                agent_name: data.agent_name,
                zone: data.zone,
                lga: data.lga,
            };

            setAgentInfo(info);
            onValidAgent(info);
        } catch (err: any) {
            setValidationError('Invalid agent code');
            setAgentInfo(null);
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            validateAgentCode(value);
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [value]);

    return (
        <div className="space-y-3">
            <div>
                <Label htmlFor="agent_code">Agent Code *</Label>
                <div className="relative">
                    <Input
                        id="agent_code"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        placeholder="e.g., AG847291"
                        className="font-mono text-center"
                        style={{ letterSpacing: '2px' }}
                    />
                    {isValidating && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}
                </div>
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                {validationError && <p className="text-sm text-red-600 mt-1">{validationError}</p>}
                <p className="text-xs text-gray-500 mt-1">
                    Enter the agent code provided to you
                </p>
            </div>

            {agentInfo && !validationError && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        <div className="space-y-1">
                            <p className="font-medium flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                Valid Agent Code!
                            </p>
                            <div className="text-sm space-y-1">
                                <p><strong>Agent:</strong> {agentInfo.agent_name}</p>
                                <p><strong>Zone:</strong> {agentInfo.zone}</p>
                                <p><strong>LGA:</strong> {agentInfo.lga}</p>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {!agentInfo && !isValidating && value.length >= 6 && !validationError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Agent code not found. Please check with your agent.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};