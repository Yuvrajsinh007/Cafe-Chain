// client-unified/src/admin/pages/AnalyticsPage.js
import React from "react";
import AnalyticsChart from "../components/AnalyticsChart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm">Detailed performance reports</p>
      </div>
      <AnalyticsChart />
    </div>
  );
}