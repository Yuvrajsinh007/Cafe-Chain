import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyForgotPasswordOTP, sendForgotPasswordOTP } from '../api/api'; // Import from API file

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { mobile } = location.state || {}; // Safety check

  // On mount → restore timer from localStorage
  useEffect(() => {
    if (!mobile) {
        navigate('/user/forgot-password');
        return;
    }
    const expiry = localStorage.getItem(`otp_resend_expiry_${mobile}`);
    if (expiry) {
      const remaining = Math.floor((+expiry - Date.now()) / 1000);
      if (remaining > 0) setResendTimer(remaining);
    }
  }, [mobile, navigate]);

  // Countdown effect
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem(`otp_resend_expiry_${mobile}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer, mobile]);

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Enter OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use API function
      const res = await verifyForgotPasswordOTP(mobile, otp);

      if (res.success) {
        localStorage.removeItem(`otp_resend_expiry_${mobile}`); // clear timer on success
        navigate('/user/reset-password', { state: { mobile } });
      }
    } catch (err) {
      // API client throws the error message string directly
      setError(err || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const expiry = Date.now() + 59 * 1000;
    setResendTimer(59);
    localStorage.setItem(`otp_resend_expiry_${mobile}`, expiry.toString());

    try {
      // Use API function
      await sendForgotPasswordOTP(mobile);
    } catch (err) {
      setError(err || 'Failed to resend OTP');
      setResendTimer(0);
      localStorage.removeItem(`otp_resend_expiry_${mobile}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4 pt-20 md:pt-0">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Decorative background */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          We’ve sent an OTP to your linked email address associated with: <br />
           <span className="font-semibold text-[#4A3A2F]">{mobile}</span> 
        </p>

        {/* OTP Input */}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-4 focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm text-center tracking-widest"
          maxLength={6}
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Resend OTP */}
        <button
          onClick={handleResendOTP}
          disabled={resendTimer > 0}
          className={`w-full mt-3 py-3 rounded-xl font-semibold text-sm tracking-wide border transition-all duration-300 ${
            resendTimer > 0
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-[#4A3A2F] border-[#4A3A2F] hover:bg-[#4A3A2F] hover:text-white shadow-sm'
          }`}
        >
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : 'Resend OTP'}
        </button>

        {/* Back link */}
        <p
          onClick={() => navigate('/user/forgot-password')}
          className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Forgot Password
        </p>
      </div>
    </div>
  );
};

export default VerifyOTPPage;