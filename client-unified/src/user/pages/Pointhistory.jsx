// ✅ The Fix is on this line: Add 'useContext' to the import
import React, { useState, useEffect, useContext } from "react"; 
import { ArrowLeft, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext"; // Keep using your custom hook
import { getUserCafePoints } from "../api/api";

// The component name in the error is UserCafePointsPage, so I am assuming that's the component in this file.
const UserCafePointsPage = () => { 
  const navigate = useNavigate();
  const { user } = useAuth(); // This line now works correctly
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

  // ... rest of your component's JSX remains the same
  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-white pt-20 md:pt-0 pb-20">
      {/* Back Button */}
      <motion.button
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-[#4a3a2f] hover:opacity-80 focus:outline-none focus:ring-0 border-none"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </motion.button>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-extrabold mb-8 text-[#4a3a2f] text-center md:text-left flex items-center gap-2"
      >
        <Coffee className="w-6 h-6" /> Your Cafe Points
      </motion.h1>

      {error ? (
        <div className="text-center text-red-500 mt-20">{error}</div>
      ) : userPoints.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          You have no points in any cafe yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPoints.map((cafe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="p-5 border rounded-2xl bg-white shadow-md hover:shadow-xl transition-all"
            >
              <div className="font-bold text-lg text-[#4a3a2f]">
                {cafe.cafeName}
              </div>
              <div className="mt-2 text-gray-600">
                Points: <span className="font-semibold">{cafe.points}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCafePointsPage;