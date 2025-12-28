import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { resetPassword } from '../api/api'; 
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Separate states for toggling visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    if (!password || !confirmPassword) return toast.error('Please fill all fields');
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirmPassword) return toast.error('Passwords do not match');

    setIsLoading(true);
    try {
      const response = await resetPassword({ email, newPassword: password });
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
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-[#4A3A2F]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-amber-900/10 border border-gray-100 relative z-10">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shadow-sm transform rotate-3">
                <KeyRound className="w-8 h-8" strokeWidth={1.5} />
            </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-[#4A3A2F] mb-3 tracking-tight">
          Set New Password
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
          Please create a strong password that you haven't used before.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-gray-400 text-gray-800"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                    // Updated type based on showConfirmPassword state
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-gray-400 text-gray-800"
                    required
                />
                <button
                    type="button"
                    // Updated click handler for independent toggle
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 mt-2 ${
                isLoading
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-[#4A3A2F] hover:bg-[#3b2d24] hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Updating...
                </span>
            ) : (
                'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
                onClick={() => navigate('/cafe/auth/login')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#4A3A2F] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;