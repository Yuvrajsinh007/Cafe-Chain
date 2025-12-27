// client-unified/src/admin/pages/AdminLoginPage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, checkAdminExists } from "../api/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminExists, setAdminExists] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      const isAdminCreated = await checkAdminExists();
      setAdminExists(isAdminCreated);
    };
    verifyAdminStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        await loginAdmin({ email, password });
        navigate("/pithad/dashboard");
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow-lg w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <input className="border px-3 py-2 rounded w-full mb-4" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border px-3 py-2 rounded w-full mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700" type="submit">
          Login
        </button>
        {!adminExists && (
          <div className="text-center mt-4">
            <span className="text-sm text-red-600">No admin account found.</span>
            <button
              type="button"
              className="text-blue-600 underline text-sm ml-1"
              onClick={() => navigate("/pithad/signup")}
            >
              Create one now.
            </button>
          </div>
        )}
      </form>
    </div>
  );
}