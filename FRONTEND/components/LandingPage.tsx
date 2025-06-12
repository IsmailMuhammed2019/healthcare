'use client';

import React from 'react';
import { ArrowRight, Shield, Activity, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
    const router = useRouter();

    const handleStartRegistration = () => {
        router.push('/register');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">


            {/* Hero Section */}
            <section className="relative px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-800 text-sm font-medium mb-8">
                            <Activity className="w-4 h-4 mr-2" />
                            Quality Healthcare Registration Platform
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Your Health,
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Our Priority</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of Nigerians who trust Firstcare Health Partners for comprehensive healthcare coverage, welfare advisory, and insurance services.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleStartRegistration}
                                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center"
                            >
                                Get Started Today
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 text-gray-800 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full opacity-20 animate-pulse"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-20 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Firstcare?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience seamless healthcare registration with cutting-edge technology and comprehensive coverage.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Coverage</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Complete healthcare, welfare advisory, and insurance services tailored for organizations and individuals across Nigeria.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <Activity className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Digital Innovation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Modern digital registration portal with secure payment processing, face verification, and instant ID card generation.
                            </p>
                        </div>

                        <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Clients</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Thousands of satisfied clients across Kaduna State rely on Firstcare for their health and welfare needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-8">
                                Join the Firstcare Community
                            </h2>
                            <div className="space-y-6">
                                {[
                                    'Instant digital registration with QR-coded ID cards',
                                    'Flexible payment options - ₦6,000 registration + ₦200 daily dues',
                                    'Emergency contact and beneficiary protection',
                                    'Multi-zone coverage across Kaduna State',
                                    'Support and guidance throughout the process'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <p className="text-gray-700 text-lg">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                                <p className="text-emerald-100 mb-6 text-lg">
                                    Begin your journey with Firstcare Health Partners today.
                                </p>
                                <button
                                    onClick={handleStartRegistration}
                                    className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
                                >
                                    Start Registration
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-400 rounded-full opacity-20"></div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-400 rounded-full opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default LandingPage;