// PrivacyPolicyPage.jsx (Final with Loader)

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Loader from '../components/Loader'; // ✅ Import Loader

const PrivacyPolicyPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate short load delay
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />; // ✅ Show loader first
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-[#4a3a2f] font-sans pt-10 md:pt-0 pb-20"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#4a3a2f] transition-colors mb-8 font-semibold focus:outline-none focus:ring-0 border-none"
                >
                    <ChevronLeft size={20} />
                    Back
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
                    <p className="text-gray-500">Effective Date: August 6, 2025</p>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">1. Introduction</h2>
                        {/* <p>Welcome to CafeChain. CafeChain.in ("CafeChain", "we", "us", or "our") is committed to protecting the privacy of our customers. This Privacy Policy explains how we collect, use, and safeguard your personal information when you create an account and use our website, located at <a href="https://www.cafechain.in" className="font-semibold text-[#4a3a2f] underline">cafechain.in</a> (the "Service").</p> */}
                        <p>By creating an account or using our Service, you agree to the terms outlined in this policy.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">2. Information We Collect</h2>
                        <p>We collect information that is essential to provide and manage our loyalty program. The types of information we collect are strictly limited to the following:</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-[#4a3a2f]">A. Information You Provide Directly</h3>
                                <p>When you register for a loyalty account on our website, we collect the following information:</p>
                                <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                                    <li><strong>Name:</strong> To personalize your account.</li>
                                    <li><strong>Mobile Number:</strong> To serve as your unique identifier for the loyalty program and for account verification.</li>
                                    <li><strong>Password:</strong> To secure your account access.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#4a3a2f]">B. Information Collected During In-Store Purchases</h3>
                                <p>When you visit one of our cafes and provide your registered mobile number, our cashier will access your loyalty profile to record your purchase. We only collect:</p>
                                <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                                    <li><strong>Transactional Data:</strong> The total number of items and the final bill amount of your purchase.</li>
                                </ul>
                                <p className="mt-2">We do not collect itemized details of your bill or any payment information (like credit card details). This transactional data is linked to your account solely for the purpose of administering loyalty points.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#4a3a2f]">C. Information from Third Parties</h3>
                                <p><strong>Mobile Number Verification:</strong> To ensure the security of your account, we use a third-party service provider to verify your mobile number during registration. This provider receives your mobile number for the sole purpose of sending you a One-Time Password (OTP).</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#4a3a2f]">D. Automatically Collected Usage Data</h3>
                                <p>Like most websites, our servers automatically log basic information when you visit our website, such as your IP address, browser type, and the pages you visited. This data is used for analytical purposes to improve our website's performance and is not linked to your personal profile in a way that identifies you individually.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">3. How We Use Your Information</h2>
                        <p>We use the information we collect strictly for the following purposes:</p>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                            <li><strong>To Provide and Manage Your Account:</strong> To create your loyalty account, authenticate your identity when you log in, and maintain your profile.</li>
                            <li><strong>To Administer Our Loyalty Program:</strong> To track your purchases and credit your account with the appropriate loyalty points and rewards.</li>
                            <li><strong>To Communicate With You:</strong> To send an OTP for verification and, if you have provided your optional email address, to send important account notices or promotional offers (with your consent).</li>
                            <li><strong>For Security:</strong> To protect your account from unauthorized access and to prevent fraud.</li>
                            <li><strong>To Comply with Legal Obligations:</strong> To meet any applicable legal or regulatory requirements.</li>
                        </ul>
                    </section>

                    {/* ... Other sections follow the same pattern ... */}

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">Contact Us</h2>
                        <p>   If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                        <div className="mt-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
                            <p className="font-semibold">CafeChain Customer Support</p>
                            <p><strong>Email:</strong> team.cafechain@gmail.com</p>
                            <p><strong>Address:</strong> Surat Gujarat India</p>
                           
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacyPolicyPage;
