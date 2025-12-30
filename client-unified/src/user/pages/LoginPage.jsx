import React, { useState, useEffect } from 'react';
import { Phone, Lock, Eye, EyeOff, Users, Zap, Shield, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Images/cc.png';

const LoginForm = ({
  formData,
  showPassword,
  loading,
  error,
  onInputChange,
  onTogglePassword,
  onSubmit,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  isMobile = false
}) => {
  const PasswordIcon = showPassword ? EyeOff : Eye;

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
        {!isMobile && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1 text-[#4a3a2f]">Sign In</h2>
            <p className="text-gray-600 text-sm">Enter your credentials</p>
          </div>
        )}

        {/* Phone Input */}
        <div className="space-y-1.5 md:space-y-2">
          <label className="block text-sm font-semibold text-[#4a3a2f]">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="Enter your mobile number"
              // Compact padding on mobile
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border-2 rounded-lg md:rounded-xl focus:outline-none focus:border-gray-400 text-sm md:text-base"
              maxLength="10"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5 md:space-y-2">
          <label className="block text-sm font-semibold text-[#4a3a2f]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Enter your password"
              className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 border-2 rounded-lg md:rounded-xl focus:outline-none focus:border-gray-400 text-sm md:text-base"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <PasswordIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs md:text-sm">
            {error}
          </div>
        )}

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            className="text-gray-600 hover:underline text-xs md:text-sm font-medium"
            onClick={onNavigateToForgotPassword}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-white transition-all disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02] text-sm md:text-base"
          style={{
            backgroundColor: loading ? '#6b5b4d' : '#4a3a2f',
            boxShadow: '0 4px 20px rgba(74, 58, 47, 0.3)'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Sign Up */}
      <div className="text-center mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-100 text-sm md:text-base">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          onClick={onNavigateToSignUp}
          className="font-semibold hover:underline text-[#4a3a2f]"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

const LoginPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.phone || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.phone, formData.password);
      if (result.success) {
        navigate('/user/home');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Star, text: "Premium Experience" },
    { icon: Users, text: "Connect with Coffee Lovers" },
    { icon: Zap, text: "Fast & Rewarding Points" },
    { icon: Shield, text: "Secure & Trusted Platform" }
  ];

  const formProps = {
    formData,
    showPassword,
    loading,
    error,
    onInputChange: handleInputChange,
    onTogglePassword: () => setShowPassword(!showPassword),
    onSubmit: handleSubmit,
    onNavigateToSignUp: () => onNavigate && onNavigate('signup'),
    onNavigateToForgotPassword: () => navigate('/user/forgot-password'),
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .logo-border-glow {
          border: 4px solid white;
          border-radius: 9999px;
          box-shadow: 0 0 12px rgba(255,255,255,0.8),
                      0 0 24px rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Desktop */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left */}
        <div className="flex-1 flex flex-col items-center justify-center text-white bg-[#4a3a2f] px-8">
          {/* Logo + Text */}
          <div className="text-center">
            <div className="inline-block logo-border-glow p-1">
              <img
                src={logo}
                alt="CafeChain Logo"
                loading="lazy"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold mt-6">CafeChain</h1>
            <p className="text-lg opacity-90 mt-2 max-w-md mx-auto">
              Where every cup tells a story and every connection matters
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-md mx-auto mt-12">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-sm">
            <LoginForm {...formProps} />

            {/* Login as Cafe Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/cafe/auth/login")}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: "#6b4f3a",
                  boxShadow: "0 4px 15px rgba(74, 58, 47, 0.25)"
                }}
              >
                Login as Cafe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen flex flex-col bg-white">
        <div className="pt-8 pb-6 px-6 bg-white rounded-b-3xl">
          <div className="text-center">
            {/* Added Logo for mobile */}
            <div className="inline-block p-1 mb-4">
               <img src={logo} alt="CafeChain Logo" className="w-16 h-16 rounded-full object-cover mx-auto shadow-md" />
            </div>
            <h1 className="text-2xl font-bold mb-1 text-[#4a3a2f]">Welcome Back!</h1>
            <p className="text-sm text-gray-600">Sign in to continue your coffee journey</p>
          </div>
        </div>
        <div className="flex-1 px-6 pb-8 bg-gray-50 rounded-t-3xl pt-8 shadow-inner">
          <LoginForm {...formProps} isMobile />

          {/* Login as Cafe Button (Mobile) */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/cafe/auth/login")}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] text-sm"
              style={{
                backgroundColor: "#6b4f3a",
                boxShadow: "0 4px 15px rgba(74, 58, 47, 0.25)"
              }}
            >
              Login as Cafe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;