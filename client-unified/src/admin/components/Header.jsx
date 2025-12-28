import React from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Bell, LogOut, User } from "lucide-react";

export default function Header() {
  const { admin, logout } = useAdminAuth();
  
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm sticky top-0 z-30">
      <div className="flex flex-col">
         <h2 className="text-xl font-bold text-gray-800">Welcome back, Admin</h2>
         <p className="text-sm text-gray-500">Here is what’s happening today.</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-amber-600 transition-colors">
             <Bell className="w-6 h-6" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
             <div className="font-bold text-gray-700 text-sm">{admin?.name || "Administrator"}</div>
             <div className="text-xs text-amber-600 font-medium">Super Admin</div>
          </div>
          
          <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 border-2 border-amber-50">
            <User className="w-5 h-5" />
          </div>

          <button
            onClick={logout}
            className="ml-2 p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}