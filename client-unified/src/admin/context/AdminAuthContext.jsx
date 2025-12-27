// src/admin/context/AdminAuthContext.js

import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState({ name: "Super Admin", role: "superadmin" });

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }

  const { admin, setAdmin } = context;

  const logout = () => {
    console.log("Logging out...");
    
    localStorage.removeItem('admin_token');
    
    setAdmin(null);
    
    navigate('/pithad/login'); 
  };

  return { admin, logout };
}