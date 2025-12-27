import React from "react";
import { Routes, Route, Outlet } from "react-router-dom"; // Import Outlet
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
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminInvoicesPage from "./pages/invoice";
import EventManagementPage from './pages/EventManagementPage';
import AdminSignupPage from "./pages/AdminSignupPage";
import ContactSubmissionsPage from './pages/ContactSubmissionsPage';
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// The AdminLayout now uses <Outlet> to render the matched child route
const AdminLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

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
              <Route index element={<DashboardPage />} /> {/* Default route for /pithad */}
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

        {/* 404 Fallback - You might want a more generic one if this is part of a larger app */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AdminAuthProvider>
  );
}