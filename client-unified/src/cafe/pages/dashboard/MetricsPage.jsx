import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getLoyaltyMetrics } from "../../api/api";
import Loader from "../../components/Loader";
import { ArrowLeft, TrendingUp, BarChart3, CreditCard } from "lucide-react";

const cardVariants = {
  rest: { scale: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
  hover: { scale: 1.05, boxShadow: "0 12px 24px rgba(0,0,0,0.12)" },
  float: {
    y: [0, -6, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
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
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] transition-colors mb-8 font-medium"
        >
            <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <h1 className="text-4xl md:text-5xl font-black text-[#4A3A2F] tracking-tight mb-4">
                Loyalty Insights
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Track your program's performance and customer engagement in real-time.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Redeemed Amount */}
            <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                animate="float"
                className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-900/5 border border-amber-100 flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                    <div className="p-4 bg-amber-100 rounded-full text-amber-600 mb-6 mx-auto w-fit">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl font-black text-[#4A3A2F] mb-2">
                        {metrics?.pointsRedeemedToday ?? 0}
                    </h2>
                    <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                        Redeemed Today
                    </p>
                </div>
            </motion.div>

            {/* Card 2: Redemption Rate */}
            <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                animate="float"
                className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-100 flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600 mb-6 mx-auto w-fit">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl font-black text-blue-900 mb-2">
                        {metrics?.redemptionRate ?? 0}%
                    </h2>
                    <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                        Monthly Rate
                    </p>
                </div>
            </motion.div>

            {/* Card 3: Avg Transaction */}
            <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                animate="float"
                className="bg-white rounded-3xl p-8 shadow-xl shadow-green-900/5 border border-green-100 flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                    <div className="p-4 bg-green-100 rounded-full text-green-600 mb-6 mx-auto w-fit">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <h2 className="text-5xl font-black text-green-900 mb-2">
                        {metrics?.avgPointsPerTransaction ?? 0}
                    </h2>
                    <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">
                        Avg. Transaction
                    </p>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
}

export default MetricsPage;