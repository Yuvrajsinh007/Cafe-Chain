import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, checkAdminExists } from "../api/api";
import { Coffee, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminExists, setAdminExists] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        await loginAdmin({ email, password });
        navigate("/pithad/dashboard");
      } catch (error) {
        console.error("Login failed", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-[#4A3A2F] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="relative z-10 text-center text-white p-12">
           <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-900/50">
             <Coffee className="w-10 h-10" />
           </div>
           <h1 className="text-4xl font-bold mb-4">CafeChain Admin</h1>
           <p className="text-amber-200/80 text-lg max-w-md mx-auto">Manage cafes, monitor analytics, and grow your coffee network from one central hub.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                    <input 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" 
                        type="email" 
                        placeholder="admin@cafechain.com" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                    <input 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button 
                    className="w-full bg-[#4A3A2F] text-white py-3.5 rounded-xl font-bold hover:bg-[#3b2d24] transition-all transform active:scale-95 shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2" 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>

                {!adminExists && (
                <div className="text-center mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-sm text-amber-800 block mb-2">No admin account found.</span>
                    <button
                        type="button"
                        className="text-amber-600 font-bold text-sm hover:underline"
                        onClick={() => navigate("/pithad/signup")}
                    >
                        Create Root Admin Account
                    </button>
                </div>
                )}
            </form>
        </div>
      </div>
    </div>
  );
}