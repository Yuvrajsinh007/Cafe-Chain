// client-unified/src/admin/components/AdminProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const adminToken = localStorage.getItem('admin_token');

  // If token exists, render the child routes.
  // Otherwise, redirect to the correct login page URL.
  return adminToken ? <Outlet /> : <Navigate to="/pithad/login" replace />;
};

export default AdminProtectedRoute;