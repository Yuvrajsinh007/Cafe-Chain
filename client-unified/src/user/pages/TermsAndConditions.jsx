import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Loader from '../components/Loader';
import { useState, useEffect } from 'react';

const TermsAndConditionsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
   }, []);

   if (loading) return <Loader />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white text-[#4a3a2f] font-sans pt-10 md:pt-0 pb-20 "
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms and Conditions</h1>
                    <p className="text-gray-500">Last Updated: August 30, 2025</p>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By creating an account and using the CafeChain application and its related services (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all of these Terms, do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">2. The Loyalty Program</h2>
                        <p>
                            CafeChain provides a digital loyalty program where users can earn points ("CashPoints") on purchases at participating cafes and redeem them for rewards.
                        </p>
                         <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                            <li><strong>Earning Points:</strong> Points are earned based on purchases made at partner cafes. The rate of earning may vary and is subject to change.</li>
                            <li><strong>Redeeming Rewards:</strong> Points can be redeemed for products, discounts, or other offers as specified within the Service. Rewards have no cash value and cannot be exchanged for cash.</li>
                             <li><strong>Expiration:</strong> We reserve the right to implement an expiration policy for points at a future date, with prior notification to users.</li>
                           <li>
  <strong>Invoice Restriction:</strong> An invoice may only be used to claim points on a single platform. If an invoice is redeemed outside CafeChain, it cannot be used again on CafeChain, and vice versa.
</li>

                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">3. Account Registration and Security</h2>
                        <p>
                            You must register for an account to use the Service. You agree to provide accurate, current, and complete information during registration. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">4. User Conduct</h2>
                        <p>
                            You agree not to use the Service for any unlawful purpose or in any way that could harm, disable, or impair the Service. Prohibited activities include, but are not limited to, creating fraudulent accounts, manipulating the points system, or harassing other users or cafe staff.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">5. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is otherwise harmful to other users of the Service, us, or third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">6. Disclaimers</h2>
                        <p>
                            The Service is provided on an "as is" and "as available" basis. We make no warranty that the Service will meet your requirements or be available on an uninterrupted, secure, or error-free basis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">7. Limitation of Liability</h2>
                        <p>
                           In no event shall CafeChain be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">8. Changes to Terms</h2>
                        <p>
                            We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any such change constitutes your acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#4a3a2f] mb-3">9. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us:</p>
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

export default TermsAndConditionsPage;