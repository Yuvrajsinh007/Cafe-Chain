import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
import CafeApprovalQueuePage from "./pages/CafeApprovalQueuePage";
import CafeListPage from "./pages/CafeListPage";
import CafeDetailPage from "./pages/CafeDetailPage";
import UserLookupPage from "./pages/UserLookupPage";
import UserProfilePage from "./pages/UserProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PromotionsPage from "./pages/PromotionsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminInvoicesPage from "./pages/invoice";
import EventManagementPage from './pages/EventManagementPage';
import AdminSignupPage from "./pages/AdminSignupPage";
import ContactSubmissionsPage from './pages/ContactSubmissionsPage';
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Updated AdminLayout with Mobile State
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar gets state to toggle visibility on mobile */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col w-full">
        {/* Header gets state to show Hamburger button */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
          {/* --- Public Routes --- */}
          <Route path="login" element={<AdminLoginPage />} />
          <Route path="signup" element={<AdminSignupPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="events" element={<EventManagementPage />} />
              <Route path="/contact-submissions" element={<ContactSubmissionsPage />} /> 
              <Route path="cafes/approval-queue" element={<CafeApprovalQueuePage />} />
              <Route path="cafes" element={<CafeListPage />} />
              <Route path="cafes/:id" element={<CafeDetailPage />} />
              <Route path="users" element={<UserLookupPage />} />
              <Route path="users/:id" element={<UserProfilePage />} />
              <Route path="profile/:id" element={<UserProfilePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="promotions" element={<PromotionsPage />} />
              <Route path="invoices" element={<AdminInvoicesPage />} />
            </Route>
          </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AdminAuthProvider>
  );
}