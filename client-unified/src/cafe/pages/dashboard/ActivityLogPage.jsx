import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getActivityLog } from "../../api/api";
import Loader from "../../components/Loader";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from "lucide-react";

// ✨ Card animation
const cardVariants = {
  rest: { scale: 1, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  hover: { scale: 1.05, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" },
};

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
        console.error("Failed to fetch activity log", error);
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
    <div className="relative min-h-screen bg-gradient-to-br from-white via-[#fdf8f4] to-[#f3ece6] px-6 md:px-12 py-12">
      {/* 🔙 Back Button */}
  <button
  onClick={() => navigate(-1)}
  className="absolute top-6 left-6 flex items-center gap-2 text-[#4a3a2f] hover:text-black transition text-base md:text-lg font-medium
             border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:outline-none bg-transparent"
>
  <ArrowLeft size={22} /> Back
</button>


      {/* ✨ Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center text-[#2b1d14] mb-10 md:mb-14 tracking-tight"
      >
        Activity Log
        <span className="block text-lg md:text-xl font-medium text-[#6b5649] mt-3">
          Your Points Summary
        </span>
      </motion.h1>

      {/* ⏳ Time Filter */}
      <div className="max-w-md mx-auto mb-12">
        <label htmlFor="timeFilter" className="flex items-center gap-2 text-sm font-semibold text-[#4a3a2f] mb-3">
          <Calendar size={18} /> Time Period
        </label>
        <select
          id="timeFilter"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="block w-full pl-4 pr-10 py-3 text-base border border-[#c2b6aa] focus:outline-none focus:ring-2 focus:ring-[#4a3a2f] sm:text-sm rounded-xl bg-white shadow"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* 📊 Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* ✅ Earned Points */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="rest"
          variants={cardVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-white to-green-100 text-[#1d3a29] rounded-3xl shadow-lg p-10 md:p-14 h-56 border border-green-200"
        >
          <TrendingUp size={36} className="text-green-600 mb-4" />
          <p className="text-base md:text-lg font-medium opacity-90">Points Earned</p>
          <h2 className="text-5xl md:text-6xl font-extrabold mt-4">{totalPointsEarned}</h2>
        </motion.div>

        {/* ❌ Redeemed Points */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="rest"
          variants={cardVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-white to-red-100 text-[#4a1d1d] rounded-3xl shadow-lg p-10 md:p-14 h-56 border border-red-200"
        >
          <TrendingDown size={36} className="text-red-600 mb-4" />
          <p className="text-base md:text-lg font-medium opacity-90">Points Redeemed</p>
          <h2 className="text-5xl md:text-6xl font-extrabold mt-4">{totalPointsRedeemed}</h2>
        </motion.div>
      </div>
    </div>
  );
}

export default ActivityLogPage;
