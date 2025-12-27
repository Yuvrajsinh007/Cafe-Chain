import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getLoyaltyMetrics } from "../../api/api"; // backend unchanged
import Loader from "../../components/Loader";

const cardVariants = {
  rest: { scale: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
  hover: { scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" },
  float: {
    y: [0, -6, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
};

function MetricsPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getLoyaltyMetrics();
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch loyalty metrics", error);
        setMetrics({
          pointsRedeemedToday: 0,
          redemptionRate: 0,
          avgPointsPerTransaction: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white px-6 sm:px-8 md:px-12 py-10 md:py-16">
      {/* Back Button */}
    <button
  onClick={() => navigate(-1)}
  className="absolute top-6 left-6 flex items-center gap-2 
             text-gray-800 hover:text-gray-600 transition 
             text-base md:text-lg font-medium 
             bg-transparent border-none 
             focus:outline-none focus:ring-0 
             active:outline-none active:ring-0 
             focus-visible:outline-none"
>
  ← Back
</button>


      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight"
      >
        Loyalty Program Metrics
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
        {/* Points Redeemed Today */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={cardVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#FFE4C4] to-[#FFD580] text-gray-900 rounded-3xl shadow-lg p-8 sm:p-10 md:p-12 border border-gray-200 hover:shadow-xl transition-all"
        >
          <p className="text-sm sm:text-base font-medium opacity-90">Redeemed Amount(Today)</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 text-[#B55A1B]">
            {metrics?.pointsRedeemedToday ?? 0}
          </h2>
        </motion.div>

        {/* Redemption Rate */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={cardVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#CDEFFF] to-[#7AC7E3] text-gray-900 rounded-3xl shadow-lg p-8 sm:p-10 md:p-12 border border-gray-200 hover:shadow-xl transition-all"
        >
          <p className="text-sm sm:text-base font-medium opacity-90">Redemption Rate (Monthly)</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 text-[#0B3D91]">
            {metrics?.redemptionRate ?? 0}%
          </h2>
        </motion.div>

        {/* Avg Points Per Transaction */}
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="float"
          variants={cardVariants}
          className="flex flex-col justify-center items-center bg-gradient-to-br from-[#E8F4E8] to-[#A8E6A3] text-gray-900 rounded-3xl shadow-lg p-8 sm:p-10 md:p-12 border border-gray-200 hover:shadow-xl transition-all"
        >
          <p className="text-sm sm:text-base font-medium opacity-90">Avg. Amount / Transaction</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 text-[#1F6D1F]">
            {metrics?.avgPointsPerTransaction ?? 0}
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

export default MetricsPage;