import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { requestPasswordReset } from '../../api/api';
import { Mail, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSendOTP = async (e) => {
    e.preventDefault(); // Prevent form submission refresh if wrapped in form
    if (!email || !validateEmail(email)) {
      return setError("Enter a valid email address");
    }

    setLoading(true);
    setError("");

    try {
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
          Forgot Password?
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
          Don't worry! It happens. Please enter the email address associated with your account.
        </p>

        <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        placeholder="cafe@example.com"
                        className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all placeholder-gray-400 text-gray-800 ${
                            error 
                            ? "border-red-300 focus:ring-red-200 focus:border-red-400 bg-red-50" 
                            : "border-gray-200 focus:ring-amber-500/20 focus:border-amber-500"
                        }`}
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
                        {error}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-amber-900/20 transition-all transform active:scale-98 flex items-center justify-center gap-2 ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed opacity-70"
                        : "bg-[#4A3A2F] hover:bg-[#3b2d24] hover:shadow-xl hover:-translate-y-0.5"
                }`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Sending...
                    </span>
                ) : (
                    <>Send Code <ArrowRight className="w-5 h-5" /></>
                )}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
                onClick={() => navigate("/cafe/auth/login")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#4A3A2F] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;