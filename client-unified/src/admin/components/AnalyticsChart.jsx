import React from "react";

export default function AnalyticsChart() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="mb-4 flex gap-2">
        <select className="border px-2 py-1 rounded">
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center text-gray-400">
        [Line chart visualization here]
      </div>
    </div>
  );
}