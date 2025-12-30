import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetUserPassword } from '../api/api'; 
import { Eye, EyeOff } from 'lucide-react'; // Added icons

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { mobile } = location.state || {}; // Safety check

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await resetUserPassword(mobile, password);
      
      if (res.success) {
        navigate('/user/login', {
          state: { message: 'Password updated successfully' },
        });
      }
    } catch (err) {
      setError(err || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-6 pt-2 md:pt-0">
      <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">

        {/* Decorative blob */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-[#4A3A2F] mb-2 md:mb-3">
          Reset Password
        </h2>
        <p className="text-xs md:text-sm text-gray-600 text-center mb-6 md:mb-8">
          Enter a new password for your account linked to:
          <br />
          <span className="font-semibold text-[#4A3A2F]">{mobile}</span>
        </p>

        {/* New Password Input */}
        <div className="relative mb-3 md:mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            // Adjusted padding-right (pr-10) to make room for the icon
            className="w-full border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 md:py-3 text-sm focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A3A2F] transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            // Adjusted padding-right (pr-10) to make room for the icon
            className="w-full border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 md:py-3 text-sm focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A3A2F] transition-colors focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs md:text-sm mb-4 text-center font-medium bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Save Button */}
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className={`w-full py-2.5 md:py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#4A3A2F] hover:bg-[#6B5646] shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? 'Saving...' : 'Save Password'}
        </button>

        {/* Back link */}
        <p
          onClick={() => navigate('/user/login')}
          className="mt-4 md:mt-6 text-center text-xs md:text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;