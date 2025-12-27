import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyPasswordOtp, requestPasswordReset } from '../api/api';

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
      // Use API function
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
      // Use API function
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>
        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          We’ve sent an OTP to your email address <br />
          <span className="font-semibold text-[#4A3A2F]">{email}</span>
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-4 focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm text-center tracking-widest"
          maxLength={6}
        />
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">{error}</p>
        )}
        <button
          onClick={handleVerifyOTP}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg'}`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendTimer > 0}
            className={`text-sm font-medium transition-colors ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#4A3A2F] hover:underline'}`}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyForgotPasswordOTPPage;