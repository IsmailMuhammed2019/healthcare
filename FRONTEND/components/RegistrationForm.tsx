'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Upload, User, Phone, MapPin, Users, CreditCard, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

import { useRegistrationStore, KADUNA_ZONES, KADUNA_LGAS, RELATIONSHIPS } from '@/store/registrationStore';
import { submitRegistration, uploadPhoto } from '@/lib/api';

// Form validation schemas for each step
const personalInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    middleName: z.string().optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    sex: z.enum(['M', 'F'], { required_error: 'Please select your sex' }),
    phoneNumber: z.string().min(11, 'Phone number must be at least 11 digits'),
    nin: z.string().min(11, 'NIN must be at least 11 characters'),
});

const locationInfoSchema = z.object({
    address: z.string().min(10, 'Address must be at least 10 characters'),
    state: z.string().min(1, 'State is required'),
    lga: z.string().min(1, 'LGA is required'),
    zone: z.string().min(1, 'Zone is required'),
    unit: z.string().min(1, 'Unit is required'),
});

const emergencyContactSchema = z.object({
    emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
    emergencyContactAddress: z.string().min(10, 'Emergency contact address is required'),
    emergencyContactPhone: z.string().min(11, 'Emergency contact phone is required'),
});

const beneficiariesSchema = z.object({
    beneficiary1Name: z.string().min(2, 'Beneficiary 1 name is required'),
    beneficiary1Address: z.string().min(10, 'Beneficiary 1 address is required'),
    beneficiary1Phone: z.string().min(11, 'Beneficiary 1 phone is required'),
    beneficiary1Relationship: z.string().min(1, 'Beneficiary 1 relationship is required'),
    beneficiary2Name: z.string().optional(),
    beneficiary2Address: z.string().optional(),
    beneficiary2Phone: z.string().optional(),
    beneficiary2Relationship: z.string().optional(),
});

const PhotoCapture: React.FC = () => {
    const { data, setPhoto } = useRegistrationStore();
    const [showCamera, setShowCamera] = useState(false);
    const [webcamRef, setWebcamRef] = useState<Webcam | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(file, e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [setPhoto]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1
    });

    const capturePhoto = useCallback(() => {
        if (webcamRef) {
            const imageSrc = webcamRef.getScreenshot();
            if (imageSrc) {
                // Convert base64 to blob
                fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
                        setPhoto(file, imageSrc);
                        setShowCamera(false);
                    });
            }
        }
    }, [webcamRef, setPhoto]);

    return (
        <div className="space-y-4">
            <Label className="text-sm font-medium">Upload Photo</Label>

            {!showCamera && !data.photoPreview && (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                        }`}
                >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    {isDragActive ? (
                        <p>Drop the photo here...</p>
                    ) : (
                        <div>
                            <p className="mb-2">Drag & drop a photo here, or click to select</p>
                            <p className="text-sm text-gray-500">Supports JPG, PNG files</p>
                        </div>
                    )}
                </div>
            )}

            {!showCamera && !data.photoPreview && (
                <div className="text-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCamera(true)}
                        className="w-full"
                    >
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo with Camera
                    </Button>
                </div>
            )}

            {showCamera && (
                <div className="space-y-4">
                    <Webcam
                        ref={setWebcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <div className="flex space-x-2 justify-center">
                        <Button onClick={capturePhoto}>
                            <Camera className="mr-2 h-4 w-4" />
                            Capture
                        </Button>
                        <Button variant="outline" onClick={() => setShowCamera(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {data.photoPreview && (
                <div className="text-center space-y-4">
                    <img
                        src={data.photoPreview}
                        alt="Preview"
                        className="w-32 h-40 object-cover mx-auto rounded-lg border"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPhoto(new File([], ''), '')}
                        size="sm"
                    >
                        Change Photo
                    </Button>
                </div>
            )}
        </div>
    );
};

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
    currentStep,
    totalSteps,
}) => {
    const progress = (currentStep / totalSteps) * 100;

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Photo', icon: Camera },
        { number: 3, title: 'Location', icon: MapPin },
        { number: 4, title: 'Emergency Contact', icon: Phone },
        { number: 5, title: 'Beneficiaries', icon: Users },
        { number: 6, title: 'Review & Submit', icon: FileText },
    ];

    return (
        <div className="mb-8">
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
                {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.number}
                            className={`flex flex-col items-center space-y-2 ${step.number === currentStep
                                ? 'text-primary'
                                : step.number < currentStep
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step.number === currentStep
                                    ? 'bg-primary text-white'
                                    : step.number < currentStep
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {step.number < currentStep ? '✓' : step.number}
                            </div>
                            <Icon className="h-4 w-4" />
                            <span className="text-xs text-center">{step.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RegistrationForm: React.FC = () => {
    const {
        currentStep,
        data,
        isLoading,
        error,
        updateData,
        nextStep,
        prevStep,
        setLoading,
        setError,
    } = useRegistrationStore();

    const personalForm = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            sex: data.sex,
            phoneNumber: data.phoneNumber,
            nin: data.nin,
        },
    });

    const locationForm = useForm({
        resolver: zodResolver(locationInfoSchema),
        defaultValues: {
            address: data.address,
            state: data.state,
            lga: data.lga,
            zone: data.zone,
            unit: data.unit,
        },
    });

    const emergencyForm = useForm({
        resolver: zodResolver(emergencyContactSchema),
        defaultValues: {
            emergencyContactName: data.emergencyContactName,
            emergencyContactAddress: data.emergencyContactAddress,
            emergencyContactPhone: data.emergencyContactPhone,
        },
    });

    const beneficiariesForm = useForm({
        resolver: zodResolver(beneficiariesSchema),
        defaultValues: {
            beneficiary1Name: data.beneficiary1Name,
            beneficiary1Address: data.beneficiary1Address,
            beneficiary1Phone: data.beneficiary1Phone,
            beneficiary1Relationship: data.beneficiary1Relationship,
            beneficiary2Name: data.beneficiary2Name,
            beneficiary2Address: data.beneficiary2Address,
            beneficiary2Phone: data.beneficiary2Phone,
            beneficiary2Relationship: data.beneficiary2Relationship,
        },
    });

    const handlePersonalSubmit = (formData: any) => {
        updateData(formData);
        nextStep();
    };

    const handleLocationSubmit = (formData: any) => {
        updateData(formData);
        nextStep();
    };

    const handleEmergencySubmit = (formData: any) => {
        updateData(formData);
        nextStep();
    };

    const handleBeneficiariesSubmit = (formData: any) => {
        updateData(formData);
        nextStep();
    };

    const handleFinalSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Submit registration
            const response = await submitRegistration(data);

            if (response.registration_id) {
                updateData({ registrationId: response.registration_id });

                // Upload photo if exists
                if (data.photo) {
                    await uploadPhoto(response.registration_id, data.photo);
                }

                updateData({ registrationComplete: true });
                nextStep();
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Please provide your basic personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            {...personalForm.register('firstName')}
                                            placeholder="Enter your first name"
                                        />
                                        {personalForm.formState.errors.firstName && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {personalForm.formState.errors.firstName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="middleName">Middle Name</Label>
                                        <Input
                                            id="middleName"
                                            {...personalForm.register('middleName')}
                                            placeholder="Enter your middle name (optional)"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            {...personalForm.register('lastName')}
                                            placeholder="Enter your last name"
                                        />
                                        {personalForm.formState.errors.lastName && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {personalForm.formState.errors.lastName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            {...personalForm.register('dateOfBirth')}
                                        />
                                        {personalForm.formState.errors.dateOfBirth && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {personalForm.formState.errors.dateOfBirth.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="sex">Sex *</Label>
                                        <Select onValueChange={(value) => personalForm.setValue('sex', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your sex" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="M">Male</SelectItem>
                                                <SelectItem value="F">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {personalForm.formState.errors.sex && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {personalForm.formState.errors.sex.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                                        <Input
                                            id="phoneNumber"
                                            {...personalForm.register('phoneNumber')}
                                            placeholder="e.g., 08012345678"
                                        />
                                        {personalForm.formState.errors.phoneNumber && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {personalForm.formState.errors.phoneNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="nin">National Identification Number (NIN) *</Label>
                                        <Input
                                            id="nin"
                                            {...personalForm.register('nin')}
                                            placeholder="Enter your 11-digit NIN"
                                        />
                                        {personalForm.formState.errors.nin && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {personalForm.formState.errors.nin.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit">
                                        Next Step
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Camera className="mr-2 h-5 w-5" />
                                Photo Upload
                            </CardTitle>
                            <CardDescription>
                                Upload your passport photograph or take a photo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PhotoCapture />
                            <div className="flex justify-between mt-6">
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!data.photoPreview}
                                >
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 3:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                Location Information
                            </CardTitle>
                            <CardDescription>
                                Provide your address and location details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={locationForm.handleSubmit(handleLocationSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="address">Full Address *</Label>
                                    <Textarea
                                        id="address"
                                        {...locationForm.register('address')}
                                        placeholder="Enter your complete address"
                                        rows={3}
                                    />
                                    {locationForm.formState.errors.address && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {locationForm.formState.errors.address.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            value="Kaduna"
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="lga">Local Government Area *</Label>
                                        <Select onValueChange={(value) => locationForm.setValue('lga', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your LGA" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {KADUNA_LGAS.map((lga) => (
                                                    <SelectItem key={lga} value={lga}>
                                                        {lga}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {locationForm.formState.errors.lga && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {locationForm.formState.errors.lga.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="zone">Zone *</Label>
                                        <Select onValueChange={(value) => locationForm.setValue('zone', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your zone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {KADUNA_ZONES.map((zone) => (
                                                    <SelectItem key={zone} value={zone}>
                                                        {zone}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {locationForm.formState.errors.zone && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {locationForm.formState.errors.zone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="unit">Unit *</Label>
                                        <Input
                                            id="unit"
                                            {...locationForm.register('unit')}
                                            placeholder="Enter your unit"
                                        />
                                        {locationForm.formState.errors.unit && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {locationForm.formState.errors.unit.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Previous
                                    </Button>
                                    <Button type="submit">
                                        Next Step
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 4:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Phone className="mr-2 h-5 w-5" />
                                Emergency Contact
                            </CardTitle>
                            <CardDescription>
                                Provide details of your emergency contact person
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={emergencyForm.handleSubmit(handleEmergencySubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="emergencyContactName">Full Name *</Label>
                                    <Input
                                        id="emergencyContactName"
                                        {...emergencyForm.register('emergencyContactName')}
                                        placeholder="Enter emergency contact name"
                                    />
                                    {emergencyForm.formState.errors.emergencyContactName && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {emergencyForm.formState.errors.emergencyContactName.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="emergencyContactAddress">Address *</Label>
                                    <Textarea
                                        id="emergencyContactAddress"
                                        {...emergencyForm.register('emergencyContactAddress')}
                                        placeholder="Enter emergency contact address"
                                        rows={3}
                                    />
                                    {emergencyForm.formState.errors.emergencyContactAddress && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {emergencyForm.formState.errors.emergencyContactAddress.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                                    <Input
                                        id="emergencyContactPhone"
                                        {...emergencyForm.register('emergencyContactPhone')}
                                        placeholder="e.g., 08012345678"
                                    />
                                    {emergencyForm.formState.errors.emergencyContactPhone && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {emergencyForm.formState.errors.emergencyContactPhone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Previous
                                    </Button>
                                    <Button type="submit">
                                        Next Step
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 5:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Insurance Beneficiaries
                            </CardTitle>
                            <CardDescription>
                                Provide details of your insurance beneficiaries (at least one required)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={beneficiariesForm.handleSubmit(handleBeneficiariesSubmit)} className="space-y-6">
                                {/* Beneficiary 1 */}
                                <div className="border rounded-lg p-4 space-y-4">
                                    <h3 className="font-medium text-lg">Primary Beneficiary *</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="beneficiary1Name">Full Name *</Label>
                                            <Input
                                                id="beneficiary1Name"
                                                {...beneficiariesForm.register('beneficiary1Name')}
                                                placeholder="Enter beneficiary name"
                                            />
                                            {beneficiariesForm.formState.errors.beneficiary1Name && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {beneficiariesForm.formState.errors.beneficiary1Name.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiary1Relationship">Relationship *</Label>
                                            <Select onValueChange={(value) => beneficiariesForm.setValue('beneficiary1Relationship', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {RELATIONSHIPS.map((rel) => (
                                                        <SelectItem key={rel} value={rel}>
                                                            {rel}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {beneficiariesForm.formState.errors.beneficiary1Relationship && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {beneficiariesForm.formState.errors.beneficiary1Relationship.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiary1Phone">Phone Number *</Label>
                                            <Input
                                                id="beneficiary1Phone"
                                                {...beneficiariesForm.register('beneficiary1Phone')}
                                                placeholder="e.g., 08012345678"
                                            />
                                            {beneficiariesForm.formState.errors.beneficiary1Phone && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {beneficiariesForm.formState.errors.beneficiary1Phone.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiary1Address">Address *</Label>
                                            <Textarea
                                                id="beneficiary1Address"
                                                {...beneficiariesForm.register('beneficiary1Address')}
                                                placeholder="Enter beneficiary address"
                                                rows={2}
                                            />
                                            {beneficiariesForm.formState.errors.beneficiary1Address && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {beneficiariesForm.formState.errors.beneficiary1Address.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Beneficiary 2 */}
                                <div className="border rounded-lg p-4 space-y-4">
                                    <h3 className="font-medium text-lg">Secondary Beneficiary (Optional)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="beneficiary2Name">Full Name</Label>
                                            <Input
                                                id="beneficiary2Name"
                                                {...beneficiariesForm.register('beneficiary2Name')}
                                                placeholder="Enter beneficiary name (optional)"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiary2Relationship">Relationship</Label>
                                            <Select onValueChange={(value) => beneficiariesForm.setValue('beneficiary2Relationship', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {RELATIONSHIPS.map((rel) => (
                                                        <SelectItem key={rel} value={rel}>
                                                            {rel}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiary2Phone">Phone Number</Label>
                                            <Input
                                                id="beneficiary2Phone"
                                                {...beneficiariesForm.register('beneficiary2Phone')}
                                                placeholder="e.g., 08012345678"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="beneficiary2Address">Address</Label>
                                            <Textarea
                                                id="beneficiary2Address"
                                                {...beneficiariesForm.register('beneficiary2Address')}
                                                placeholder="Enter beneficiary address"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Previous
                                    </Button>
                                    <Button type="submit">
                                        Review Details
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 6:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Review & Submit
                            </CardTitle>
                            <CardDescription>
                                Please review your information before submitting
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Personal Information */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium text-lg mb-3">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><strong>Name:</strong> {data.firstName} {data.middleName} {data.lastName}</div>
                                    <div><strong>Date of Birth:</strong> {data.dateOfBirth}</div>
                                    <div><strong>Sex:</strong> {data.sex === 'M' ? 'Male' : 'Female'}</div>
                                    <div><strong>Phone:</strong> {data.phoneNumber}</div>
                                    <div><strong>NIN:</strong> {data.nin}</div>
                                </div>
                            </div>

                            {/* Photo */}
                            {data.photoPreview && (
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium text-lg mb-3">Photo</h3>
                                    <img
                                        src={data.photoPreview}
                                        alt="Your photo"
                                        className="w-24 h-32 object-cover rounded border"
                                    />
                                </div>
                            )}

                            {/* Location */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium text-lg mb-3">Location Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><strong>Address:</strong> {data.address}</div>
                                    <div><strong>State:</strong> {data.state}</div>
                                    <div><strong>LGA:</strong> {data.lga}</div>
                                    <div><strong>Zone:</strong> {data.zone}</div>
                                    <div><strong>Unit:</strong> {data.unit}</div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium text-lg mb-3">Emergency Contact</h3>
                                <div className="text-sm space-y-1">
                                    <div><strong>Name:</strong> {data.emergencyContactName}</div>
                                    <div><strong>Phone:</strong> {data.emergencyContactPhone}</div>
                                    <div><strong>Address:</strong> {data.emergencyContactAddress}</div>
                                </div>
                            </div>

                            {/* Beneficiaries */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium text-lg mb-3">Insurance Beneficiaries</h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium">Primary Beneficiary</h4>
                                        <div className="text-sm space-y-1">
                                            <div><strong>Name:</strong> {data.beneficiary1Name}</div>
                                            <div><strong>Relationship:</strong> {data.beneficiary1Relationship}</div>
                                            <div><strong>Phone:</strong> {data.beneficiary1Phone}</div>
                                        </div>
                                    </div>
                                    {data.beneficiary2Name && (
                                        <div>
                                            <h4 className="font-medium">Secondary Beneficiary</h4>
                                            <div className="text-sm space-y-1">
                                                <div><strong>Name:</strong> {data.beneficiary2Name}</div>
                                                <div><strong>Relationship:</strong> {data.beneficiary2Relationship}</div>
                                                <div><strong>Phone:</strong> {data.beneficiary2Phone}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Information */}
                            <Alert>
                                <CreditCard className="h-4 w-4" />
                                <AlertDescription>
                                    Registration Fee: ₦6,000 (includes jacket and registration)
                                    <br />
                                    Daily Dues: ₦200 per day, 6 days a week
                                </AlertDescription>
                            </Alert>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {Array.isArray(error)
                                            ? error.map((e, i) => (
                                                <div key={i}>
                                                    {e.msg
                                                        ? `${e.loc?.join('.')}: ${e.msg}`
                                                        : JSON.stringify(e)}
                                                </div>
                                            ))
                                            : typeof error === 'object'
                                                ? JSON.stringify(error)
                                                : error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleFinalSubmit}
                                    disabled={isLoading}
                                    className="min-w-[120px]"
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Firstcare Health Partners Registration
                </h1>
                <p className="text-center text-gray-600">
                    Complete your registration to become a member
                </p>
            </div>

            <StepIndicator currentStep={currentStep} totalSteps={6} />

            {renderStep()}
        </div>
    );
};

export default RegistrationForm;