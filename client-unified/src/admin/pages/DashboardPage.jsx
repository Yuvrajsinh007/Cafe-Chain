import React from "react";
import KPISection from "../components/KPISection";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <KPISection />
    </div>
  );
}