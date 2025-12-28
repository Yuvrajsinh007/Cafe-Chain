import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetDashboardStats } from "../api/api";
import { Users, Store, Coffee, Clock } from "lucide-react";

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

  const Card = ({ title, value, subtext, icon: Icon, colorClass, onClick, borderClass }) => (
    <div 
        onClick={onClick}
        className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${borderClass}`}
    >
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-800">{loading ? "-" : value}</h3>
                {subtext && <p className={`text-xs mt-2 font-medium ${colorClass}`}>{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl ${colorClass.replace('text-', 'bg-').replace('600', '100')} ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {/* Background decoration */}
        <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 ${colorClass}`}>
             <Icon className="w-24 h-24" />
        </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={Users} 
        colorClass="text-blue-600"
        onClick={() => navigate('/pithad/users')}
      />
      
      <Card 
        title="Active Cafes" 
        value={stats.totalCafes} 
        icon={Store} 
        colorClass="text-green-600"
        subtext="+ Registered Partners"
        onClick={() => navigate('/pithad/cafes')}
      />

      <Card 
        title="Redemptions (24h)" 
        value={stats.recentRedemptions} 
        icon={Coffee} 
        colorClass="text-amber-600"
        subtext="Recent Activity"
      />

      <Card 
        title="Pending Approvals" 
        value={stats.pendingCafes} 
        icon={Clock} 
        colorClass="text-orange-600"
        subtext="Needs Attention"
        borderClass="ring-2 ring-orange-100"
        onClick={() => navigate('/pithad/cafes/approval-queue')}
      />
    </div>
  );
}