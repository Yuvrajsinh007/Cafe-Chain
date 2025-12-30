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

        // Merge the leaderboard and current user profile data
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
        return <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 drop-shadow-glow animate-pulse" />;
      case 2:
        return <Medal className="w-5 h-5 md:w-6 md:h-6 text-gray-500 drop-shadow-glow animate-pulse" />;
      case 3:
        return <Award className="w-5 h-5 md:w-6 md:h-6 text-amber-600 drop-shadow-glow animate-pulse" />;
      default:
        return <span className="text-base md:text-lg font-bold text-gray-500">{rank}</span>;
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
    // Changed font-['Inter'] to font-playfair
    <div className="min-h-screen bg-[#ffffff] text-gray-900 font-playfair px-4 py-4 md:p-10 pb-24 md:pb-10 overflow-hidden pt-16 md:pt-0">
      
      {/* Injected Styles */}
      {/* ... inside your return (...) ... */}
      
      <style>{`
        /* 1. Playfair Display (Current - Elegant Serif) */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        
        /* 2. Cinzel (Luxury/Roman) */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&display=swap');
        
        /* 3. Poppins (Modern Sans) */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        
        /* 4. DM Serif Display (Bold Classic) */
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');

        /* --- Utility Classes --- */
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-dm-serif { font-family: 'DM Serif Display', serif; }

        /* --- Effects --- */
        .drop-shadow-glow { filter: drop-shadow(0 0 8px rgba(0,0,0,0.1)); }
        
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
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
      `}</style>

      <motion.div
        className="text-center mb-6 md:mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* TRY CHANGING 'font-playfair' TO 'font-cinzel' OR 'font-dm-serif' HERE */}
        <h1 className="text-2xl md:text-5xl font-bold mb-2">
          Leaderboard
        </h1>
        {/* Poppins is great for smaller text */}
        <p className="text-gray-600 text-sm md:text-lg italic font-poppins">Top 15 Coffee Enthusiasts</p>
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

      {/* Mobile Podium - Scaled Down */}
      {topThree.length > 0 && (
        <motion.div
          className="flex md:hidden justify-center items-end mb-6 relative w-full max-w-sm mx-auto space-x-2" 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[topThree[1], topThree[0], topThree[2]]
            .filter((user) => user !== undefined)
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
                // Smaller circle on mobile (w-12 h-12)
                className={`w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 border-2 border-gray-300 ${getPodiumColor(
                  user.rank
                )}`}
              >
                {renderAvatar(user, "w-full h-full")}
              </motion.div>
              <div className="text-xs font-semibold truncate max-w-[80px] text-center text-gray-800">
                {user.name}
              </div>
              <div className="text-[10px] text-gray-500 font-bold">
                {user.xp.toLocaleString()} XP
              </div>
              <div className="mt-0.5 transform scale-75">{getRankIcon(user.rank)}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Announcement Banner */}
      <div className="relative bg-[#4A3A2F] text-white px-3 py-2 md:px-4 md:py-3 rounded-xl mb-6 text-center shadow-md overflow-hidden">
        <span className="relative z-10 text-xs md:text-base tracking-wide">
          📢 <span className="font-semibold">Next Week Special:</span> Top 3 users’ points will
          increase by <span className="text-yellow-300 font-bold"> 1.5x</span>!
        </span>
        <div className="absolute inset-0">
          <div className="shine absolute inset-0"></div>
        </div>
      </div>

      {/* Current User Stats Card - Compact */}
      {currentUser && (
        <motion.div
          className="bg-gray-100 p-3 md:p-5 rounded-xl md:rounded-2xl border border-gray-200 shadow-lg mb-6 text-gray-800"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm md:text-base">You</span>
                <span className="text-xs text-gray-500">Rank: {currentUser.rank}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base md:text-lg font-bold">{currentUser.xp.toLocaleString()}</div>
              <div className="text-[10px] md:text-xs text-gray-500">XP</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Remaining List - Compact */}
      <motion.div
        className="bg-gray-100 rounded-xl md:rounded-2xl shadow-lg p-3 md:p-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="space-y-3">
          {remainingUsers.map((user) => (
            <motion.div
              key={user.rank}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-3 md:p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="text-gray-500 w-6 md:w-8 text-sm md:text-base font-medium">{user.rank}</div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs">
                    {renderAvatar(user, "w-8 h-8 md:w-10 md:h-10")}
                  </div>
                  <span className="font-semibold text-sm md:text-base truncate max-w-[120px] md:max-w-none">{user.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm md:text-lg font-bold">{user.xp.toLocaleString()}</div>
                <div className="text-[10px] md:text-xs text-gray-500">XP</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;