import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import { resendEmailOtp } from '../api/api';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Expect email and phone to be provided via navigation state
  const { email, phone } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    if (!email || !phone) {
      setError('Missing email or phone. Please sign up again.');
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyEmail({ email, phone, otp });
      if (result.success) {
        navigate('/user/home');
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError(err || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await resendEmailOtp({ email, phone });
      setInfo('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Adjusted padding: pt-16 for mobile to prevent navbar overlap if any, centering content
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 md:px-6 pt-16 md:pt-0">
      <div className="w-full max-w-sm bg-white rounded-xl md:rounded-2xl shadow-md p-5 md:p-6 border border-gray-100">
        <div className="text-center mb-5 md:mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#4a3a2f]/10 rounded-full flex items-center justify-center">
               <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#4a3a2f]" />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#4a3a2f]">Verify Your Email</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Enter the 6-digit code sent to <br/><span className="font-semibold text-gray-800">{email || 'your email'}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-[#4a3a2f] mb-1.5">Verification Code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                // Compact padding and centered text for OTP
                className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a3a2f] focus:border-transparent bg-gray-50 text-sm md:text-base text-center tracking-widest font-mono"
                maxLength="6"
                required
              />
            </div>
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs md:text-sm text-center">{error}</div>}
          {info && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs md:text-sm text-center">{info}</div>}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#4a3a2f] text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-sm"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        
        <button 
            onClick={handleResend} 
            disabled={loading} 
            className="w-full mt-3 bg-gray-100 text-[#4a3a2f] py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;