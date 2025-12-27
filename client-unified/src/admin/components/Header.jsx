import React from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Header() {
  const { admin, logout } = useAdminAuth();
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="font-semibold">{admin?.name || "Admin"}</span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}