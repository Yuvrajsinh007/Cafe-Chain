import React from "react";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

export default function AnalyticsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
         <div>
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" /> Performance Overview
            </h3>
            <p className="text-sm text-gray-500">User growth and engagement statistics</p>
         </div>
         
         <div className="relative">
             <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-medium cursor-pointer hover:bg-gray-100 transition">
                <option>Last 30 Days</option>
                <option>This Year</option>
             </select>
             <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
         </div>
      </div>

      <div className="h-72 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
             <BarChart3 className="w-8 h-8 text-gray-300" />
        </div>
        <span className="font-medium">Chart Visualization Placeholder</span>
        <span className="text-xs mt-1 text-gray-400">Integrate Recharts or Chart.js here</span>
      </div>
    </div>
  );
}