// User App.jsx - Works with nested routing

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import MobileNavbar from './components/MobileNavbar';
import HomePage from './pages/HomePage';
import CafesPage from './pages/CafesPage';
import CafeDetailPage from './pages/CafeDetailPage';
import RewardsPage from './pages/RewardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import WelcomePage from './pages/WelcomePage';
import ClaimRewardPage from './pages/ClaimRewardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import axios from 'axios';
import InvoiceHistoryPage from "./pages/InvoiceHistoryPage";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditions';
import PointHistoryPage from './pages/Pointhistory';
import ContactUsPage from './pages/ContactUsPage';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
};

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/user/home' || path === '/user') setActivePage('home');
    else if (path.startsWith('/user/cafes')) setActivePage('cafes');
    else if (path === '/user/rewards') setActivePage('rewards');
    else if (path === '/user/leaderboard') setActivePage('leaderboard');
    else if (path === '/user/profile') setActivePage('profile');
  }, [location]);

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const handleAuthNavigation = (page) => {
    if (page === 'login') navigate('/user/login');
    else if (page === 'signup') navigate('/user/signup');
  };

  const isAuthPage =
    location.pathname === '/user' ||
    location.pathname === '/user/' ||
    location.pathname === '/user/login' ||
    location.pathname === '/user/signup' ||
    location.pathname === '/user/welcome' ||
    location.pathname === '/user/verify-email';

  // Include new policy page in known routes
  const isKnownRoute = () => {
    const p = location.pathname;
    const known = new Set([
      '/user', '/user/', '/user/welcome', '/user/login', '/user/signup', '/user/verify-email',
      '/user/forgot-password', '/user/verify-otp', '/user/reset-password',
      '/user/home', '/user/cafes', '/user/rewards', '/user/claim-reward', '/user/leaderboard', '/user/profile',
      '/user/privacy-policy', '/user/terms-and-conditions', '/user/invoice-history', '/user/contactus','/user/points-history'
    ]); 
    if (known.has(p)) return true;
    if (p.startsWith('/user/cafes/')) return true;
    return false;
  };

  const isUnknownRoute = !isKnownRoute();
  const hideNavbars = isAuthPage || (isUnknownRoute && !isAuthenticated);

  return (
    <div className="min-h-screen bg-background">
      {!hideNavbars && (
        <>
          <div className="hidden md:block sticky top-0 z-50">
            <Navbar onSearch={handleSearch} />
          </div>
          <div className="md:hidden">
            <MobileNavbar />
          </div>
        </>
      )}

      <main className="pt-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage onNavigate={handleAuthNavigation} />} />
          <Route path="/signup" element={<SignupPage onNavigate={handleAuthNavigation} />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Policy page */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage/>} />
          <Route path="/contactus" element={<ContactUsPage/>} />

          {/* Forgot Password Flow */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/cafes" element={<ProtectedRoute><CafesPage /></ProtectedRoute>} />
          <Route path="/cafes/:id" element={<ProtectedRoute><CafeDetailPage /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
          <Route path="/claim-reward" element={<ProtectedRoute><ClaimRewardPage /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/invoice-history" element={<InvoiceHistoryPage />} />
          <Route path="/points-history" element={<PointHistoryPage/>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!hideNavbars && isAuthenticated && (
        <div className="md:hidden">
          <BottomNav activePage={activePage} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;