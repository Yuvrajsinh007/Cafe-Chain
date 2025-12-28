// Cafe App.jsx - Works with nested routing

import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext, AppProvider } from './store/AppContext'

// Layout Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/VerifyOTP'
import PendingApproval from './pages/PendingApproval'

// import FirstTimeSetup from './pages/setup/FirstTimeSetup'
import Dashboard from './pages/dashboard/Dashboard'
import MetricsPage from './pages/dashboard/MetricsPage'
import RedemptionPage from './pages/dashboard/RedemptionPage'
import AdsEventsPage from './pages/dashboard/AdsEventsPage'
import ActivityLogPage from './pages/dashboard/ActivityLogPage'
import ProfileGalleryPage from './pages/dashboard/ProfileGalleryPage'
import ContactUsPage from './pages/dashboard/ContactUsPage'
import Offers from "./pages/dashboard/Offers";


// Components
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyForgotPasswordOTPPage from './pages/VerifyForgotPasswordOTPPage'
import RestPasswordPage from './pages/ResetPasswordPage'
import { Toaster } from 'sonner';

const CafeLayout = () => {
  const { state, dispatch } = useAppContext()
  const { isLoading } = state

  useEffect(() => {
    // Initialize app by loading data from localStorage
    dispatch({ type: 'INIT_APP' })
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid #F3F4F6',
            color: '#4A3A2F',
            borderRadius: '16px',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          classNames: {
            toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#4A3A2F] group-[.toaster]:border-gray-100 group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-gray-500',
            actionButton: 'group-[.toast]:bg-[#4A3A2F] group-[.toast]:text-white',
            cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500',
            error: 'group-[.toaster]:text-red-600 group-[.toaster]:bg-red-50 group-[.toaster]:border-red-100',
            success: 'group-[.toaster]:text-green-600 group-[.toaster]:bg-green-50 group-[.toaster]:border-green-100',
            warning: 'group-[.toaster]:text-amber-600 group-[.toaster]:bg-amber-50 group-[.toaster]:border-amber-100',
            info: 'group-[.toaster]:text-blue-600 group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-100',
          },
        }}
      />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />}></Route>
          <Route path="/auth/verify-forgotpassword-otp" element={<VerifyForgotPasswordOTPPage />}></Route>
          <Route path="/auth/reset-password" element={<RestPasswordPage />}></Route>
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute requireActiveCafe={true}><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requireActiveCafe={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/metrics" element={<ProtectedRoute requireActiveCafe={true}><MetricsPage /></ProtectedRoute>} />
          <Route path="/dashboard/redemption" element={<ProtectedRoute requireActiveCafe={true}><RedemptionPage /></ProtectedRoute>} />
          <Route path="/dashboard/ads-events" element={<ProtectedRoute requireActiveCafe={true}><AdsEventsPage /></ProtectedRoute>} />
          <Route path="/dashboard/activity" element={<ProtectedRoute requireActiveCafe={true}><ActivityLogPage /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute requireActiveCafe={true}><ProfileGalleryPage /></ProtectedRoute>} />

          <Route path="/dashboard/contactus" element={<ProtectedRoute requireActiveCafe={true}><ContactUsPage /></ProtectedRoute>} />          
          <Route path="/dashboard/offers" element={<ProtectedRoute requireActiveCafe={true}><Offers /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <CafeLayout />
    </AppProvider>
  )
}

export default App;