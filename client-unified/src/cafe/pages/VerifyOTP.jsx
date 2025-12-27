// src/pages/VerifyOTP.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyRegisterOtp, resendRegisterOtp } from '../api/api';

function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/auth/register');
            toast.error("Something went wrong. Please register again.");
        }
    }, [email, navigate]);

    // Countdown effect for Resend OTP
    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setInterval(() => {
            setResendTimer(prev => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits.");
            return;
        }
        setIsLoading(true);

        try {
            // Use API function
            const response = await verifyRegisterOtp({ email, otp });
            
            toast.success(response.data.message);
            navigate('/cafe/pending-approval');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'OTP verification failed.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            // Use API function
            await resendRegisterOtp({ email });

            toast.success("OTP resent successfully!");
            setResendTimer(59);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>
                <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
                    Verify Your Account
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    An OTP has been sent to <strong>{email}</strong>. Enter it below to complete registration.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full text-center tracking-[1em] text-2xl font-semibold px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F]"
                        maxLength={6}
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
                            isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg"
                        }`}
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Complete Submission'}
                    </button>
                </form>

                <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold text-sm tracking-wide border transition-all duration-300 ${
                        resendTimer > 0
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-[#4A3A2F] border-[#4A3A2F] hover:bg-[#4A3A2F] hover:text-white shadow-sm"
                    }`}
                >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>

                <p
                    onClick={() => navigate('/auth/register')}
                    className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
                >
                    ← Back to Register
                </p>
            </div>
        </div>
    );
}

export default VerifyOTP;