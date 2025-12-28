import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getActivityLog } from "../../api/api";
import Loader from "../../components/Loader";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, History, ArrowUpRight, ArrowDownLeft } from "lucide-react";

function ActivityLogPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("today");

  useEffect(() => {
    const fetchLog = async () => {
      setIsLoading(true);
      try {
        const response = await getActivityLog(timeFilter);
        setTransactions(response.data);
      } catch (error) {
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLog();
  }, [timeFilter]);

  const totalPointsEarned = transactions
    .filter((t) => t.type === "earn")
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  const totalPointsRedeemed = transactions
    .filter((t) => t.type === "redeem")
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-12 font-sans text-gray-800">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#4A3A2F] tracking-tight">Activity Log</h1>
                <p className="text-gray-500 mt-2 text-lg">Track your cafe's points history</p>
            </div>
            
            <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-medium text-gray-700 shadow-sm appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="all">All Time</option>
                </select>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-24 h-24 text-green-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-wide mb-2">
                        <ArrowUpRight className="w-4 h-4" /> Points Issued
                    </div>
                    <h2 className="text-4xl font-black text-gray-800">{totalPointsEarned}</h2>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-24 h-24 text-red-600" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-sm uppercase tracking-wide mb-2">
                        <ArrowDownLeft className="w-4 h-4" /> Points Redeemed
                    </div>
                    <h2 className="text-4xl font-black text-gray-800">{totalPointsRedeemed}</h2>
                </div>
            </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
            {transactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {transactions.map((t, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    t.type === 'earn' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {t.type === 'earn' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg group-hover:text-[#4A3A2F] transition-colors">
                                        {t.type === 'earn' ? 'Points Issued' : 'Reward Redemption'}
                                    </p>
                                    <p className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className={`text-xl font-bold ${
                                t.type === 'earn' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {t.type === 'earn' ? '+' : '-'}{Math.abs(t.points)} XP
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <History className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No activity found</p>
                    <p className="text-sm">Try changing the time filter.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default ActivityLogPage;