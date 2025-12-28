import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { verifyRegisterOtp, resendRegisterOtp } from '../api/api';
import { MailCheck, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';

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
            await resendRegisterOtp({ email });
            toast.success("OTP resent successfully!");
            setResendTimer(59);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6 relative overflow-hidden">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-[#4A3A2F]"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-amber-900/10 border border-gray-100 relative z-10">
                
                {/* Header Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-50 rounded-2xl text-green-600 shadow-sm transform -rotate-3">
                        <MailCheck className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3 tracking-tight">
                    Verify Account
                </h2>
                <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
                    Final step! Enter the code sent to <br />
                    <span className="font-bold text-gray-800">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                if (val.length <= 6) setOtp(val);
                            }}
                            className="w-full text-center tracking-[0.8em] text-2xl font-bold px-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-gray-50 focus:bg-white transition-all text-gray-800 placeholder-gray-300"
                            maxLength={6}
                            placeholder="······"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 ${
                            isLoading || otp.length !== 6
                                ? "bg-gray-400 cursor-not-allowed opacity-70"
                                : "bg-[#4A3A2F] hover:bg-[#3b2d24] hover:shadow-xl hover:-translate-y-0.5"
                        }`}
                    >
                        {isLoading ? 'Processing...' : <>Verify & Complete <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-4">
                    <button
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0}
                        className={`w-full py-3 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all ${
                            resendTimer > 0
                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-[#4A3A2F] border-[#4A3A2F]/30 hover:border-[#4A3A2F] hover:bg-amber-50"
                        }`}
                    >
                        {resendTimer > 0 ? (
                            `Resend available in ${resendTimer}s`
                        ) : (
                            <><RotateCcw className="w-4 h-4" /> Resend Code</>
                        )}
                    </button>

                    <button
                        onClick={() => navigate('/auth/register')}
                        className="text-sm text-gray-400 hover:text-[#4A3A2F] transition-colors flex items-center gap-1 font-medium"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;