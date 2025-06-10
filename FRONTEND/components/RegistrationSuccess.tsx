'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, CreditCard, QrCode, User, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { useRegistrationStore } from '@/store/registrationStore';
import { downloadCard, getQRData, updatePayment } from '@/lib/api';

const RegistrationSuccess: React.FC = () => {
    const { data, setCurrentStep, resetForm } = useRegistrationStore();
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [qrData, setQrData] = useState<any>(null);

    useEffect(() => {
        if (data.registrationId) {
            loadQRData();
        }
    }, [data.registrationId]);

    const loadQRData = async () => {
        try {
            if (data.registrationId) {
                const qrInfo = await getQRData(data.registrationId);
                setQrData(qrInfo);

                // Generate QR code
                const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrInfo), {
                    width: 200,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
                setQrCodeUrl(qrCodeDataUrl);
            }
        } catch (error) {
            console.error('Failed to load QR data:', error);
        }
    };

    const handleDownloadCard = async () => {
        if (!data.registrationId) return;

        try {
            setIsDownloading(true);
            await downloadCard(data.registrationId, `${data.firstName}_${data.lastName}_ID_Card.pdf`);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Card download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePayment = async (paymentType: 'registration' | 'daily_dues', amount: number) => {
        if (!data.registrationId) return;

        try {
            setPaymentProcessing(true);
            await updatePayment({
                registration_id: data.registrationId,
                amount,
                payment_type: paymentType
            });

            // Reload QR data to reflect payment status
            await loadQRData();

            alert(`Payment of ₦${amount.toLocaleString()} processed successfully!`);
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const copyRegistrationId = () => {
        if (data.registrationId) {
            navigator.clipboard.writeText(data.registrationId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartNewRegistration = () => {
        resetForm();
        setCurrentStep(1);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Success Header */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-green-600">Registration Successful!</h1>
                <p className="text-gray-600">
                    Your registration has been completed successfully. Your ID card is ready for download.
                </p>
            </div>

            {/* Registration Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Registration Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                            <p className="text-lg font-medium">
                                {data.firstName} {data.middleName} {data.lastName}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Registration ID</Label>
                            <div className="flex items-center space-x-2">
                                <p className="text-lg font-mono">{data.registrationId}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={copyRegistrationId}
                                    className="h-6 w-6 p-0"
                                >
                                    {copied ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                            <p className="text-lg">{data.phoneNumber}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-500">Zone & Unit</Label>
                            <p className="text-lg">{data.zone} - {data.unit}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                            Registration Complete
                        </Badge>
                        {qrData?.payment_status?.registration_fee_paid ? (
                            <Badge className="bg-green-100 text-green-800">
                                Payment Complete
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                Payment Pending
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* QR Code and Card Download */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <QrCode className="mr-2 h-5 w-5" />
                            QR Code
                        </CardTitle>
                        <CardDescription>
                            This QR code contains your registration information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        {qrCodeUrl && (
                            <img
                                src={qrCodeUrl}
                                alt="Registration QR Code"
                                className="w-48 h-48 border rounded-lg"
                            />
                        )}
                        <p className="text-sm text-gray-500 text-center">
                            Scan this QR code to view your registration details and payment status
                        </p>
                    </CardContent>
                </Card>

                {/* Card Download */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Download className="mr-2 h-5 w-5" />
                            ID Card
                        </CardTitle>
                        <CardDescription>
                            Download your printable ID card
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Your ID card includes:
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Your photo and personal details</li>
                                <li>• Registration ID and QR code</li>
                                <li>• Contact information</li>
                                <li>• Emergency contact details</li>
                            </ul>
                        </div>

                        <Button
                            onClick={handleDownloadCard}
                            disabled={isDownloading}
                            className="w-full"
                        >
                            {isDownloading ? (
                                <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                    Generating Card...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download ID Card (PDF)
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Payment Information
                    </CardTitle>
                    <CardDescription>
                        Complete your payments to activate full membership benefits
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Registration Fee */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Registration Fee</h3>
                                {qrData?.payment_status?.registration_fee_paid ? (
                                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                                ) : (
                                    <Badge variant="destructive">Pending</Badge>
                                )}
                            </div>
                            <p className="text-2xl font-bold">₦6,000</p>
                            <p className="text-sm text-gray-600">
                                Includes jacket and registration materials
                            </p>
                            {!qrData?.payment_status?.registration_fee_paid && (
                                <Button
                                    onClick={() => handlePayment('registration', 6000)}
                                    disabled={paymentProcessing}
                                    className="w-full"
                                    size="sm"
                                >
                                    {paymentProcessing ? 'Processing...' : 'Pay Registration Fee'}
                                </Button>
                            )}
                        </div>

                        {/* Daily Dues */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Daily Dues</h3>
                                <Badge variant="outline">
                                    Balance: ₦{qrData?.payment_status?.daily_dues_balance?.toLocaleString() || 0}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold">₦200 <span className="text-sm font-normal">per day</span></p>
                            <p className="text-sm text-gray-600">
                                6 days a week (₦1,200 weekly)
                            </p>
                            <div className="space-y-2">
                                <Button
                                    onClick={() => handlePayment('daily_dues', 1200)}
                                    disabled={paymentProcessing}
                                    className="w-full"
                                    size="sm"
                                    variant="outline"
                                >
                                    Pay Weekly (₦1,200)
                                </Button>
                                <Button
                                    onClick={() => handlePayment('daily_dues', 5200)}
                                    disabled={paymentProcessing}
                                    className="w-full"
                                    size="sm"
                                    variant="outline"
                                >
                                    Pay Monthly (₦5,200)
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertDescription>
                            <strong>Important:</strong> To access full membership benefits, please ensure your registration fee is paid.
                            Daily dues should be maintained for continuous coverage.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p><strong>Firstcare Health Partners</strong></p>
                        <p>No 6, Yusuf Mohammed street,</p>
                        <p>Narayi Highcost, Barnawa, Kaduna, Kaduna state.</p>
                        <div className="flex space-x-4 mt-3">
                            <p><strong>Email:</strong> admin@firstcaregroup.com</p>
                            <p><strong>Website:</strong> www.firstcarepartners.net</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={handleStartNewRegistration}
                    variant="outline"
                    className="min-w-[200px]"
                >
                    Register Another Person
                </Button>

                <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="min-w-[200px]"
                >
                    Print This Page
                </Button>
            </div>
        </div>
    );
};

// Helper component for labels
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({
    className = '',
    children
}) => (
    <span className={className}>{children}</span>
);

export default RegistrationSuccess;