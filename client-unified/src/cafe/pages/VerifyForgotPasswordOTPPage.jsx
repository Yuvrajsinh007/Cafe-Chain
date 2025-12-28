import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { verifyPasswordOtp, requestPasswordReset } from '../api/api';
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';

const VerifyForgotPasswordOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Something went wrong. Please request a new OTP.");
      navigate('/cafe/auth/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return setError('Enter a valid 6-digit OTP');
    }
    setLoading(true);
    setError('');
    try {
      const res = await verifyPasswordOtp({ email, otp });
      if (res.data.success) {
        toast.success("OTP Verified!");
        navigate('/cafe/auth/reset-password', { state: { email } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid or expired OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendTimer(59);
    toast.loading('Resending OTP...');
    try {
      await requestPasswordReset({ email });
      toast.dismiss();
      toast.success('A new OTP has been sent.');
    } catch (err) {
      toast.dismiss();
      const errorMessage = err.response?.data?.error || 'Failed to resend OTP';
      toast.error(errorMessage);
      setResendTimer(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-[#4A3A2F]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-amber-900/10 border border-gray-100 relative z-10">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shadow-sm transform rotate-3">
                <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
            </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3 tracking-tight">
          Verify Identity
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          We’ve sent a 6-digit verification code to <br />
          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{email}</span>
        </p>

        <div className="space-y-6">
            <div>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, ''); // only numbers
                        if (val.length <= 6) setOtp(val);
                        setError('');
                    }}
                    placeholder="0 0 0 0 0 0"
                    className={`w-full text-center text-3xl font-bold tracking-[0.5em] px-4 py-4 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all placeholder-gray-200 text-gray-800 ${
                        error 
                        ? "border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50" 
                        : "border-gray-200 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                    }`}
                    maxLength={6}
                />
                {error && (
                    <p className="text-red-500 text-xs mt-2 text-center font-semibold bg-red-50 py-1 px-2 rounded-lg inline-block w-full">{error}</p>
                )}
            </div>

            <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 ${
                    loading || otp.length !== 6
                        ? "bg-gray-400 cursor-not-allowed opacity-70" 
                        : "bg-[#4A3A2F] hover:bg-[#3b2d24] hover:shadow-xl hover:-translate-y-0.5"
                }`}
            >
                {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center pt-2">
                <button
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-colors ${
                        resendTimer > 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-amber-600 hover:text-amber-700'
                    }`}
                >
                    {resendTimer > 0 ? (
                        <>Resend code in <span className="w-5 text-left">{resendTimer}s</span></>
                    ) : (
                        <><RefreshCw className="w-4 h-4" /> Resend Code</>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForgotPasswordOTPPage;