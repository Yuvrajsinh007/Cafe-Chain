import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetDashboardStats } from "../api/api"; // Import the fetch function

export default function KPISection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCafes: 0,
    recentRedemptions: 0,
    pendingCafes: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminGetDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading dashboard statistics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div 
        className="bg-white p-6 rounded shadow text-center cursor-pointer hover:bg-gray-50 transition"
        onClick={() => navigate('/pithad/users')}
      >
        <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
        <div className="text-gray-500">Total Users</div>
      </div>

      {/* Registered Cafes */}
      <div 
        className="bg-white p-6 rounded shadow text-center cursor-pointer hover:bg-gray-50 transition"
        onClick={() => navigate('/pithad/cafes')}
      >
        <div className="text-3xl font-bold text-green-600">{stats.totalCafes}</div>
        <div className="text-gray-500">Registered Cafes</div>
        <div className="text-xs text-gray-400 mt-1">
            Active Cafes
        </div>
      </div>

      {/* Redemptions (24h) */}
      <div className="bg-white p-6 rounded shadow text-center">
        <div className="text-3xl font-bold text-amber-600">{stats.recentRedemptions}</div>
        <div className="text-gray-500">Redemptions (24h)</div>
      </div>

      {/* Pending Approvals */}
      <div 
        className="bg-white p-6 rounded shadow text-center cursor-pointer hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
        onClick={() => navigate('/pithad/cafes/approval-queue')}
      >
        <div className="text-3xl font-bold text-blue-600">{stats.pendingCafes}</div>
        <div className="text-gray-500">Pending Approvals</div>
        <div className="text-xs text-blue-600 mt-1 font-medium">Click to view</div>
      </div>
    </div>
  );
}