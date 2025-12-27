// src/admin/components/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileCheck,
  Building,
  Users,
  Calendar,
  BarChart2,
  Gift,
  FileText,
  MessageCircle
} from 'lucide-react';

const navItems = [
    { to: "/pithad/dashboard", label: "Dashboard", Icon: Home },
    { to: "/pithad/cafes/approval-queue", label: "Cafe Approval Queue", Icon: FileCheck },
    { to: "/pithad/cafes", label: "Cafe List", Icon: Building },
    { to: "/pithad/users", label: "User Management", Icon: Users },
    { to: "/pithad/events", label: "Event Management", Icon: Calendar },
    { to: "/pithad/contact-submissions", label: "Contact Submissions", Icon: MessageCircle },
    { to: "/pithad/analytics", label: "Analytics", Icon: BarChart2 },
    { to: "/pithad/promotions", label: "Promotions", Icon: Gift },
    { to: "/pithad/invoices", label: "Invoices", Icon: FileText },
  ];

export default function Sidebar() {
  // ... rest of your Sidebar component
  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        CafeChain Admin
      </div>
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded mb-2 ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <item.Icon className="w-5 h-5 mr-3 text-gray-500" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}