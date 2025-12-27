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
    <div className="min-h-screen bg-warm-gray flex items-center justify-center px-6 pt-20 md:pt-0">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <Mail className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-dark-brown">Verify Your Email</h1>
          <p className="text-gray-600 mt-1">Enter the 6-digit code sent to {email || 'your email'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">OTP</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full pl-11 pr-4 py-3 border border-light-cream rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-warm-white"
                maxLength="6"
                required
              />
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
          {info && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{info}</div>}
          <button type="submit" disabled={loading} className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-dark-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        <button onClick={handleResend} disabled={loading} className="w-full mt-3 bg-light-gray text-dark-brown py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;


