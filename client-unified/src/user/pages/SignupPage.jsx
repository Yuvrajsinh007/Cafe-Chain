import React, { useState, useEffect } from 'react';
import { Phone, Lock, Eye, EyeOff, ArrowLeft, User, Mail, KeyRound, Gift, CheckCircle, Star, Award, Crown, Sparkles } from 'lucide-react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { resendEmailOtp } from '../api/api';

const SignupPage = ({ onNavigate }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState('signup');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password || !formData.email || !formData.confirmPassword) {
        setError("Please fill in all required fields"); return;
    }
    if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address"); return;
    }
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match"); return;
    }
    if (formData.phone.length !== 10) {
        setError("Please enter a valid 10-digit mobile number"); return;
    }

    setLoading(true);
    setError("");
    
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        ...(formData.referralCode ? { referralCode: formData.referralCode } : {}),
      };
      
      const response = await auth.register(payload);

      if (response.success) {
        setCurrentView("verify");
      } else {
        setError(response.error || "Signup failed");
      }
    } catch (err) {
      setError(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        email: formData.email,
        otp: formData.otp,
      };

      const response = await auth.verifyEmail(payload);

      if (response.success) {
        navigate('/user/home'); 
      } else {
        setError(response.error || "OTP verification failed");
      }
    } catch (err) {
      setError(err || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await resendEmailOtp({
        email: formData.email,
        phone: formData.phone,
      });
      alert("A new OTP has been sent to your email!"); 
    } catch (err) {
      setError(err || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const switchView = (view) => {
    setCurrentView(view);
    setError('');
    setLoading(false);
  };

  const signupFeatures = [
    { icon: Gift, text: "Welcome Bonus Rewards", desc: "Get 100 XP credit on first signup" },
    { icon: Star, text: "Exclusive XP Benefits", desc: "Earn XP on every exploration" },
    { icon: Award, text: "Loyalty Points Program", desc: "Earn points with every purchase" },
    { icon: Sparkles, text: "Special Discounts", desc: "Special offers on claimed points " }
  ];

  const verifyFeatures = [
    { icon: CheckCircle, text: "Almost There!", desc: "Just one step away from joining" },
    { icon: Star, text: "Join Our Community", desc: "Connect with fellow coffee lovers" },
    { icon: Gift, text: "Claim Your Welcome Bonus", desc: "₹100 credit waiting for you" }
  ];

  const getCurrentFeatures = () => {
    return currentView === 'verify' ? verifyFeatures : signupFeatures;
  };

  const getCurrentTitle = () => {
    return currentView === 'verify' ? 'Welcome to CafeChain!' : 'Join the CafeChain Family';
  };

  const getCurrentSubtitle = () => {
    return currentView === 'verify' 
      ? 'Your account is almost ready! Complete email verification to unlock all premium features and start earning rewards'
      : 'Become part of our premium coffee community and unlock exclusive benefits, rewards, and experiences crafted just for you';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        <div className="flex-1 flex items-center justify-center p-12 bg-white">
          <div className={`w-full max-w-md transform transition-all duration-800 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {currentView === 'signup' && (
              <>
                <SignupForm 
                  formData={formData}
                  showPassword={showPassword}
                  loading={loading}
                  error={error}
                  onInputChange={handleInputChange}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onSubmit={handleSignup}
                  onNavigate={onNavigate}
                />
                <div className="mt-6 text-center">
                  <Link 
                    to="/cafe/auth/register"
                    className="block w-full py-3 rounded-xl font-semibold text-white text-center transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: '#6b4f3a', boxShadow: '0 4px 15px rgba(74, 58, 47, 0.25)' }}
                  >
                    Register as Cafe
                  </Link>
                </div>
              </>
            )}
            {currentView === 'verify' && (
              <VerifyForm 
                formData={formData}
                loading={loading}
                error={error}
                onInputChange={handleInputChange}
                onSubmit={handleVerifyOtp}
                onBack={() => switchView('signup')}
                // -------------------- THE FIX IS HERE --------------------
                onResend={handleResendOtp}
                // ---------------------------------------------------------
              />
            )}
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#4a3a2f' }}>
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-white transform transition-all duration-1000 ${
                  mounted ? 'scale-100 rotate-12' : 'scale-0 rotate-0'
                }`}
                style={{
                  width: `${40 + i * 15}px`,
                  height: `${40 + i * 15}px`,
                  right: `${5 + i * 12}%`,
                  top: `${5 + i * 12}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center items-center p-12 text-white">
            {/* Logo with shining circular border */}
            <div className={`transform transition-all duration-700 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex justify-center items-center mb-8">
                <div className="w-32 h-32 rounded-full shadow-2xl border-2 border-white animate-pulse flex items-center justify-center bg-white">
                  <img src="/src/user/assets/images/cc.png" alt="CafeChain Logo" className="w-28 h-28 object-contain" />
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-center transition-all duration-500">
                {getCurrentTitle()}
              </h1>
              <p className="text-lg opacity-90 text-center mb-12 leading-relaxed transition-all duration-500 max-w-lg">
                {getCurrentSubtitle()}
              </p>
            </div>

            {/* Features (center aligned) */}
          <div className="space-y-6 max-w-lg w-full mx-auto flex flex-col items-center">
            {getCurrentFeatures().map((feature, index) => (
            <div
              key={`${currentView}-${index}`}
              className={`flex items-center justify-center transform transition-all duration-700 w-full max-w-md ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-sm mr-4">
              <feature.icon className="w-6 h-6" />
            </div>

            {/* Text - centered block */}
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg mb-1">{feature.text}</h3>
              <p className="text-sm opacity-80 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>


          </div>

          {/* Floating Elements */}
          <div className="absolute bottom-10 right-10 w-4 h-4 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute top-20 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-16 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-40 right-32 w-2 h-2 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Mobile Layout (unchanged except logo in header) */}
      <div className="lg:hidden min-h-screen">
        {/* Header */}
        {/* <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <button
            onClick={() => {
              if (currentView === 'verify') switchView('signup');
              else window.history.back();
            }}
            className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#4a3a2f' }} />
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-2 bg-white">
              <img src="/src/user/assets/images/cc.png" alt="CafeChain Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-lg font-bold" style={{ color: '#4a3a2f' }}>CafeChain</span>
          </div>
          <div className="w-10" />
        </div> */}

        {/* Hero Section */}
        <div className="relative py-12 px-6" style={{ backgroundColor: '#4a3a2f' }}>
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-white transition-all duration-1000 ${
                  mounted ? 'scale-100' : 'scale-0'
                }`}
                style={{
                  width: `${35 + i * 12}px`,
                  height: `${35 + i * 12}px`,
                  left: `${5 + i * 18}%`,
                  top: `${5 + i * 15}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
          <div className={`text-center text-white transform transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h1 className="text-3xl font-bold mb-3 transition-all duration-500">
              {currentView === 'signup' ? 'Join CafeChain!' : 'Almost There!'}
            </h1>
            <p className="text-lg opacity-90 transition-all duration-500">
              {currentView === 'signup' ? 'Create your account for exclusive benefits' : 'Verify your email to complete registration'}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 bg-white rounded-t-3xl -mt-6 relative z-10">
          <div className={`transform transition-all duration-800 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ animationDelay: '0.3s' }}>
            {currentView === 'signup' && (
              <SignupForm 
                formData={formData}
                showPassword={showPassword}
                loading={loading}
                error={error}
                onInputChange={handleInputChange}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleSignup}
                onNavigate={onNavigate}
                isMobile={true}
              />
            )}
            {currentView === 'verify' && (
              <VerifyForm 
              formData={formData}
              loading={loading}
              error={error}
              onInputChange={handleInputChange}
              onSubmit={handleVerifyOtp}
              onBack={() => switchView('signup')}
              // -------------------- AND THE FIX IS ALSO HERE --------------------
              onResend={handleResendOtp}
              // ----------------------------------------------------------------
              isMobile={true}
            />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Signup Form Component
const SignupForm = ({ formData, showPassword, loading, error, onInputChange, onTogglePassword, onSubmit, onNavigate, isMobile = false }) => (
  <div className="animate-fadeIn">
    <div className="space-y-6">
      {!isMobile && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#4a3a2f' }}>Create Account</h2>
          <p className="text-gray-600">Join CafeChain for exclusive benefits and rewards</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Full Name</label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter your full name"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white transition-all duration-200 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Mobile Number</label>
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="Enter your mobile number"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white transition-all duration-200 hover:border-gray-300"
            maxLength="10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Enter your email address"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white transition-all duration-200 hover:border-gray-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Password</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Create a strong password"
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white transition-all duration-200 hover:border-gray-300"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Confirm Password</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onInputChange}
            placeholder="Re-enter your password"
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>
          Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="relative group">
          <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={onInputChange}
            placeholder="Enter referral code"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white transition-all duration-200 hover:border-gray-300"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Get extra XP with a valid referral code</p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ 
          backgroundColor: loading ? '#6b5b4d' : '#4a3a2f',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(74, 58, 47, 0.3)'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating Account...</span>
          </div>
        ) : 'Create Account'}
      </button>
    </div>

    <div className="text-center mt-8 pt-6 border-t border-gray-100">
      <span className="text-gray-600">Already have an account? </span>
      <button
        onClick={() => onNavigate && onNavigate('login')}
        className="font-semibold hover:underline transition-colors"
        style={{ color: '#4a3a2f' }}
      >
        Sign In
      </button>
    </div>
  </div>
);

// Verify Form Component
const VerifyForm = ({ formData, loading, error, onInputChange, onSubmit, onBack, onResend, isMobile = false }) => (
  <div className="animate-fadeIn">
    <div className="space-y-6">
      {!isMobile && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#4a3a2f' }}>Verify Email</h2>
          <p className="text-gray-600">We've sent a 6-digit code to your email address</p>
        </div>
      )}

      <div className="text-center p-6 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#4a3a2f' }}>
          <Mail className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600">
          A verification code has been sent to<br />
          <span className="font-semibold" style={{ color: '#4a3a2f' }}>{formData.email}</span>
        </p>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            🎉 Welcome bonus of 100 XP will be credited after verification!
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: '#4a3a2f' }}>Verification Code</label>
        <div className="relative group">
          <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={onInputChange}
            placeholder="Enter 6-digit code"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 bg-white transition-all duration-200 hover:border-gray-300 text-center text-lg font-mono tracking-widest"
            maxLength="6"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
          {error}
        </div>
      )}

      <div className="text-center">
        <span className="text-gray-600 text-sm">Didn't receive the code? </span>
        <button 
          onClick={onResend} 
          disabled={loading}
          className="text-sm font-semibold hover:underline transition-colors" style={{ color: '#4a3a2f' }}>
          Resend Code
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ 
          backgroundColor: loading ? '#6b5b4d' : '#4a3a2f',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(74, 58, 47, 0.3)'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : 'Verify & Start Journey'}
      </button>

      <button
        onClick={onBack}
        className="w-full py-3 rounded-xl font-medium text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
      >
        Back to Sign Up
      </button>

      
    </div>
  </div>
);

export default SignupPage;
