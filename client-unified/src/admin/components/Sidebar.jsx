import React from "react";
import { NavLink, useLocation } from "react-router-dom"; // ✅ Import useLocation
import {
  Home,
  FileCheck,
  Building,
  Users,
  Calendar,
  BarChart2,
  Gift,
  FileText,
  MessageCircle,
  Coffee
} from 'lucide-react';

const navItems = [
    { to: "/pithad/dashboard", label: "Dashboard", Icon: Home },
    { to: "/pithad/cafes/approval-queue", label: "Approvals", Icon: FileCheck },
    { to: "/pithad/cafes", label: "Cafes", Icon: Building },
    { to: "/pithad/users", label: "Users", Icon: Users },
    { to: "/pithad/events", label: "Events", Icon: Calendar },
    { to: "/pithad/contact-submissions", label: "Messages", Icon: MessageCircle },
    { to: "/pithad/analytics", label: "Analytics", Icon: BarChart2 },
    { to: "/pithad/promotions", label: "Promotions", Icon: Gift },
    { to: "/pithad/invoices", label: "Invoices", Icon: FileText },
];

export default function Sidebar() {
  const location = useLocation(); // ✅ Get current path

  return (
    <aside className="w-64 bg-[#2A1F18] text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/50">
           <Coffee className="text-white w-6 h-6" />
        </div>
        <div>
           <h1 className="font-bold text-lg tracking-wide">CafeChain</h1>
           <span className="text-xs text-amber-500 font-medium tracking-wider uppercase">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              // ✅ CUSTOM LOGIC: 
              // If we are on the "Approvals" page, explicitly force the "Cafes" link to be inactive
              // regardless of what React Router says.
              const isCafesLink = item.to === "/pithad/cafes";
              const isOnApprovalPage = location.pathname.includes("/approval-queue");
              
              const finalActive = isCafesLink && isOnApprovalPage ? false : isActive;

              return `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                finalActive
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20 translate-x-1"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`;
            }}
          >
            {({ isActive }) => {
                // ✅ Apply the same logic to the Icon styling inside
                const isCafesLink = item.to === "/pithad/cafes";
                const isOnApprovalPage = location.pathname.includes("/approval-queue");
                const finalActive = isCafesLink && isOnApprovalPage ? false : isActive;

                return (
                    <>
                        <item.Icon className={`w-5 h-5 mr-3 transition-colors ${
                            finalActive ? "text-white" : "text-gray-500 group-hover:text-amber-400"
                        }`} />
                        <span className="font-medium">{item.label}</span>
                    </>
                );
            }}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-center text-gray-500">
            &copy; {new Date().getFullYear()} CafeChain System
        </div>
      </div>
    </aside>
  );
}