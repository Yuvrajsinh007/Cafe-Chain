import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '../../api/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendOTP = async () => {
    if (!email || !validateEmail(email)) {
      return setError("Enter a valid email address");
    }

    setLoading(true);
    setError("");

    try {
      // Use API function
      const response = await requestPasswordReset({ email });
      
      toast.success(response.data.message);
      
      navigate("/cafe/auth/verify-forgotpassword-otp", { state: { email } });
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>
        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Enter your registered email address to receive an OTP for resetting your password.
        </p>

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        <button
          onClick={handleSendOTP}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p
          onClick={() => navigate("/cafe/auth/login")}
          className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;