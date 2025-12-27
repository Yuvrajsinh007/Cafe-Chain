// client-unified/src/admin/pages/AdminSignupPage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin, checkAdminExists } from "../api/api";
import toast from "react-hot-toast";

export default function AdminSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      const isAdminCreated = await checkAdminExists();
      if (isAdminCreated) {
        toast.error("An admin account already exists.");
        navigate("/pithad/login");
      }
    };
    verifyAdminStatus();
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (email && password && name) {
      try {
        await registerAdmin({ name, email, password });
        toast.success("Account created! Please log in.");
        navigate("/pithad/login");
      } catch (error) {
        console.error("Signup failed", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-8 rounded shadow-lg w-full max-w-sm" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Admin Account</h2>
        <p className="text-center text-sm text-gray-600 mb-6">This page will be disabled after the first admin is created.</p>
        <input className="border px-3 py-2 rounded w-full mb-4" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border px-3 py-2 rounded w-full mb-4" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border px-3 py-2 rounded w-full mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700" type="submit">
          Create Admin
        </button>
      </form>
    </div>
  );
}