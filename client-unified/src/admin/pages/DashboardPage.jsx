// client-unified/src/admin/pages/DashboardPage.js
import React from "react";
import KPISection from "../components/KPISection";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time platform overview</p>
      </div>
      <KPISection />
      {/* You can add more dashboard widgets here later */}
    </div>
  );
}