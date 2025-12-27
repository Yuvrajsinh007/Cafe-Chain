import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";
import { getLeaderboard, getProfile } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const LeaderboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (authLoading) return;

      try {
        const [leaderboardRes, profileRes] = await Promise.all([
          getLeaderboard(),
          user ? getProfile(user.phone) : Promise.resolve(null),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ]);

        const usersArray = leaderboardRes.leaderboard;

        if (!Array.isArray(usersArray)) {
          console.error("API did not return a valid leaderboard array:", usersArray);
          setError("Invalid data received from the server.");
          setLoading(false);
          return;
        }

        // ✅ FIXED: Merge the leaderboard and current user profile data
        const allUsers = [...usersArray];
        if (profileRes && !allUsers.find(u => u._id === profileRes._id)) {
            allUsers.push(profileRes);
        }

        const sortedLeaderboard = [...allUsers].sort((a, b) => b.xp - a.xp);

        const rankedData = sortedLeaderboard.map((u, index) => ({
          ...u,
          rank: index + 1,
          avatar: u.name ? u.name.split(" ").map((n) => n[0]).join("") : "",
          profilePic:
            u.profilePic ||
            `https://ui-avatars.com/api/?name=${u.name.replace(/\s/g, "+")}`,
        }));
        
        // Find the current user in the fully ranked list
        const userEntry = rankedData.find((u) => u._id === user?._id);
        setCurrentUser(userEntry || null);
        
        // Display only the top 15 users in the main list
        const top15 = rankedData.slice(0, 15);

        // Filter out the current user if they are in the top 15 to avoid duplication
//         const filteredLeaderboard = top15.filter((u) => u._id !== user?._id);
        setLeaderboardData(top15);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user, authLoading]);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // --- Helper Functions ---
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-glow animate-pulse" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-500 drop-shadow-glow animate-pulse" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600 drop-shadow-glow animate-pulse" />;
      default:
        return <span className="text-lg font-bold text-gray-500">{rank}</span>;
    }
  };

  const getPodiumColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-b from-yellow-300 to-yellow-500 text-gray-900";
      case 2:
        return "bg-gradient-to-b from-gray-200 to-gray-400 text-gray-900";
      case 3:
        return "bg-gradient-to-b from-amber-300 to-amber-500 text-gray-900";
      default:
        return "bg-white shadow-sm text-gray-800";
    }
  };

  const renderAvatar = (user, size = "w-full h-full") => {
    if (user.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt={user.name}
          className={`${size} object-cover rounded-full border-2 border-gray-300 shadow-md`}
        />
      );
    }
    const initials = user.name ? user.name.split(" ").map((n) => n[0]).join("") : "";
    return (
      <div
        className={`${size} flex items-center justify-center font-bold text-gray-700 bg-gray-200 rounded-full`}
      >
        {initials}
      </div>
    );
  };

  // --- RENDER STATES ---
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ffffff]">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // --- DATA SPLIT ---
  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push(topThree[1]);
  if (topThree[0]) podiumOrder.push(topThree[0]);
  if (topThree[2]) podiumOrder.push(topThree[2]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-gray-900 font-['Inter'] p-6 md:p-10 pb-28 md:pb-10 overflow-hidden pt-20 md:pt-0">
      <style>{`.drop-shadow-glow { filter: drop-shadow(0 0 8px rgba(0,0,0,0.1)); }`}</style>
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-glow">
          Leaderboard
        </h1>
        <p className="text-gray-600 text-lg">Top 15 Coffee Enthusiasts</p>
      </motion.div>

      {/* Desktop Podium */}
      {podiumOrder.length > 0 && (
        <motion.div
          className="hidden md:flex justify-center items-end space-x-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {podiumOrder.map((user) => {
            let heightClass = "h-60"; // default
            if (user.rank === 1) heightClass = "h-80"; // tallest
            if (user.rank === 2) heightClass = "h-72"; // medium
            if (user.rank === 3) heightClass = "h-64"; // shortest

            return (
              <motion.div
                key={user.rank}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`flex flex-col items-center justify-center rounded-2xl shadow-xl p-6 md:p-8 ${getPodiumColor(
                  user.rank
                )} relative overflow-hidden w-48 md:w-60 ${heightClass}`}
              >
                <div className="absolute top-2 right-2">{getRankIcon(user.rank)}</div>
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-inner">
                  {renderAvatar(user)}
                </div>
                <h2 className="font-bold text-xl mb-1 truncate max-w-[150px] text-center">
                  {user.name}
                </h2>
                <p className="text-2xl font-extrabold drop-shadow-glow">
                  {user.xp.toLocaleString()}
                </p>
                <p className="text-sm opacity-80">XP</p>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Mobile Podium */}
      {topThree.length > 0 && (
        <motion.div
          className="flex md:hidden justify-center items-end mb-8 relative w-full max-w-sm mx-auto space-x-4" // Added space-x-4 and justify-center for better spacing if fewer than 3
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* ✅ FIXED: Filter out undefined users before mapping */}
          {[topThree[1], topThree[0], topThree[2]]
            .filter((user) => user !== undefined) // <--- CRITICAL FIX
            .map((user) => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              whileHover={{ scale: 1.15, rotate: 2 }}
              className="flex flex-col items-center w-1/3 relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(0,0,0,0.1)",
                    "0 0 20px rgba(0,0,0,0.2)",
                    "0 0 0px rgba(0,0,0,0.1)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 border-2 border-gray-300 ${getPodiumColor(
                  user.rank
                )}`}
              >
                {renderAvatar(user, "w-full h-full")}
              </motion.div>
              <div className="text-sm font-semibold truncate max-w-[90px] text-center text-gray-800">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">
                {user.xp.toLocaleString()} XP
              </div>
              <div className="mt-1">{getRankIcon(user.rank)}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Announcement Banner with shine */}
      <div className="relative bg-[#4A3A2F] text-white px-4 py-3 rounded-xl mb-6 text-center shadow-md overflow-hidden">
        <span className="relative z-10">
          📢 <span className="font-semibold">Next Week Special:</span> Top 3 users’ points will
          increase by <span className="text-yellow-300 font-bold"> 1.5x</span>!
        </span>
        <div className="absolute inset-0">
          <div className="shine absolute inset-0"></div>
        </div>
      </div>

      <style>
        {`
          .shine {
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            );
            background-size: 200% 100%;
            animation: shineMove 6s infinite;
          }

          @keyframes shineMove {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>

      {currentUser && (
        <motion.div
          className="bg-gray-100 p-4 md:p-5 rounded-2xl border border-gray-200 shadow-lg mb-8 text-gray-800"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">You</span>
                <span className="text-sm text-gray-500">Rank: {currentUser.rank}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{currentUser.xp.toLocaleString()}</div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="bg-gray-100 rounded-2xl shadow-lg p-6 md:p-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="space-y-4">
          {remainingUsers.map((user) => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 md:p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-500 w-8">{user.rank}</div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
                    {renderAvatar(user, "w-10 h-10")}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{user.xp.toLocaleString()}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;