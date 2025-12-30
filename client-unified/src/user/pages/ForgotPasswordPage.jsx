import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendForgotPasswordOTP } from "../api/api";

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await sendForgotPasswordOTP(phone); // ✅ backend untouched
      if (res.success) {
        navigate("/user/verify-otp", { state: { mobile: phone } });
      }
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
      if (err.status === 404) setPhone("");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Adjusted padding: pt-16 for mobile to prevent navbar overlap if any, centering content
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-6 pt-2 md:pt-0">
      <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-[#4A3A2F] mb-2 md:mb-3">
          Forgot Password
        </h2>
        <p className="text-xs md:text-sm text-gray-600 text-center mb-6 md:mb-8">
          Don’t worry! Enter your registered mobile number and we’ll send you an OTP to reset your password on your registered email.
        </p>

        {/* Input */}
        <div className="mb-4">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            // Compact padding on mobile
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 md:py-3 text-sm focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
            maxLength={10}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-xs md:text-sm mb-4 text-center font-medium bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Send OTP */}
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className={`w-full py-2.5 md:py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* Back to Login */}
        <p
          onClick={() => navigate("/user/login")}
          className="mt-4 md:mt-6 text-center text-xs md:text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;