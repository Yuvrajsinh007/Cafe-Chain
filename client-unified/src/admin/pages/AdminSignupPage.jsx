import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin, checkAdminExists } from "../api/api";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

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
        toast.error("Registration failed.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7] p-4">
      <form className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative overflow-hidden" onSubmit={handleSignup}>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
        
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-50 rounded-full text-green-600">
                <ShieldCheck className="w-10 h-10" />
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Setup Admin Access</h2>
        <p className="text-center text-sm text-gray-500 mb-8">This is a one-time setup for the root administrator.</p>
        
        <div className="space-y-4">
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" type="password" placeholder="Create Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>

        <button className="mt-8 w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20" type="submit">
          Create System Admin
        </button>
      </form>
    </div>
  );
}