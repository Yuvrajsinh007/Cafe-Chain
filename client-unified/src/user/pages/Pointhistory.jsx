// src/user/pages/Pointhistory.jsx
import React, { useState, useEffect } from "react"; 
import { ArrowLeft, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getUserCafePoints } from "../api/api";

const UserCafePointsPage = () => { 
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.phone) {
      setLoading(false);
      setError("You must be logged in to view your points.");
      return;
    }

    const fetchUserPoints = async () => {
      try {
        setLoading(true);
        const pointsData = await getUserCafePoints(user.phone);
        setUserPoints(pointsData);
        setError(null);
      } catch (err) {
        setError("Could not fetch your cafe points. Please try again later.");
        console.error("Fetch Points Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  if (loading) return <Loader />;

  return (
    // Adjusted padding: pt-16 for mobile (clears nav), px-4 for side margins
    <div className="min-h-screen bg-white px-4 py-6 pt-16 md:pt-0 pb-24 md:pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate(-1)}
          className="flex items-center mb-4 md:mb-6 text-[#4a3a2f] hover:opacity-80 focus:outline-none focus:ring-0 border-none text-sm md:text-base"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
          Back
        </motion.button>

        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          // Smaller font size on mobile
          className="text-2xl md:text-4xl font-extrabold mb-6 md:mb-8 text-[#4a3a2f] text-center md:text-left flex items-center justify-center md:justify-start gap-2"
        >
          <Coffee className="w-5 h-5 md:w-6 md:h-6" /> Your Cafe Points
        </motion.h1>

        {error ? (
          <div className="text-center text-red-500 mt-10 md:mt-20 text-sm md:text-base">{error}</div>
        ) : userPoints.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 md:mt-20 text-sm md:text-base">
            You have no points in any cafe yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {userPoints.map((cafe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                // Reduced padding (p-4) on mobile
                className="p-4 md:p-5 border rounded-xl md:rounded-2xl bg-white shadow-md hover:shadow-xl transition-all"
              >
                <div className="font-bold text-base md:text-lg text-[#4a3a2f]">
                  {cafe.cafeName}
                </div>
                <div className="mt-2 text-sm md:text-base text-gray-600">
                  Points: <span className="font-semibold">{cafe.points}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCafePointsPage;