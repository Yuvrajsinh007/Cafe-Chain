import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPassword } from '../api/api'; // Import specific function or apiClient

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Verification failed. Please start over.");
      navigate('/cafe/auth/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return toast.error('Please fill all fields');
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      // Uses the centralized API function
      const response = await resetPassword({
        email,
        newPassword: password
      });
      
      toast.success(response.data.message);
      navigate('/cafe/auth/login', {
        state: { message: 'Password updated successfully! Please log in.' }
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>
        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
          Create New Password
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Your new password must be different from previous passwords.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F]"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F]"
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
                {isLoading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>

        <p
            onClick={() => navigate('/cafe/auth/login')}
            className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;