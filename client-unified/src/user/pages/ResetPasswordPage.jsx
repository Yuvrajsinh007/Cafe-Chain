import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetUserPassword } from '../api/api'; // Import from API file

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Use the API function
      const res = await resetUserPassword(mobile, password);
      
      if (res.success) {
        navigate('/user/login', {
          state: { message: 'Password updated successfully' },
        });
      }
    } catch (err) {
      // API client throws the error message string directly
      setError(err || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f5f1] via-[#f2ebe3] to-[#e6d5c3] px-4 pt-20 md:pt-0">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">

        {/* Decorative blob */}
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#4A3A2F]/10 rounded-full blur-2xl"></div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8">
          Enter a new password for your account linked to:
          <br />
          <span className="font-semibold text-[#4A3A2F]">{mobile}</span>
        </p>

        {/* Input fields */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-4 focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-4 focus:ring-2 focus:ring-[#4A3A2F] focus:border-[#4A3A2F] outline-none transition shadow-sm"
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Save Button */}
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 ${
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
          className="mt-6 text-center text-sm text-[#4A3A2F] hover:underline cursor-pointer font-medium"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;