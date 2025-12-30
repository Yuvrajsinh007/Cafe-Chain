import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProfile, getInvoiceHistory, getCafes } from "../api/api";
import Loader from "../components/Loader";
import CafeCard from "../components/CafeCard";
import UpcomingEvents from "../components/UpcomingEvents";
import GlobalAnnouncementBanner from "../components/GlobalAnnouncementBanner";
import { Search, Heart, Users, Gift, Coffee } from "lucide-react";

// ============================================================
// Animated Background Balls Component
// ============================================================
const AnimatedBalls = () => {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ballsData = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 30 + 10,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setBalls(ballsData);

    const animateBalls = () => {
      setBalls(prevBalls => prevBalls.map(ball => {
        let newX = ball.x + ball.vx;
        let newY = ball.y + ball.vy;
        let newVx = ball.vx;
        let newVy = ball.vy;

        if (newX <= 0 || newX >= window.innerWidth - ball.size) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(window.innerWidth - ball.size, newX));
        }
        if (newY <= 0 || newY >= window.innerHeight - ball.size) {
          newVy = -newVy;
          newY = Math.max(0, Math.min(window.innerHeight - ball.size, newY));
        }

        return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
      }));
    };

    const interval = setInterval(animateBalls, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {balls.map(ball => (
        <motion.div
          key={ball.id}
          className="absolute rounded-full bg-white"
          style={{
            left: ball.x,
            top: ball.y,
            width: ball.size,
            height: ball.size,
            opacity: ball.opacity
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [ball.opacity, ball.opacity * 0.5, ball.opacity]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// Animated Subtitle for Hero
// ============================================================
const AnimatedHeaderSubtitle = ({ lines }) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setLineIndex((prev) => (prev + 1) % lines.length),
      5000
    );
    return () => clearInterval(interval);
  }, [lines.length]);

  const lineVariants = {
    animate: { transition: { staggerChildren: 0.03 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  };

  const charVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  return (
    <div className="text-lg md:text-3xl font-medium text-amber-200 mb-8 min-h-[2rem] md:min-h-[3rem]">
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          variants={lineVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {lines[lineIndex].split("").map((char, idx) => (
            <motion.span
              key={idx}
              variants={charVariants}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// HomePage Component
// ============================================================
const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [points, setPoints] = useState(0);
  const [activities, setActivities] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) {
        setLoading(false);
        return;
      }

      try {
        const profileRes = await getProfile(user.phone);
        if (profileRes?.xp !== undefined) {
          setPoints(profileRes.xp);
        }

        const invoiceRes = await getInvoiceHistory();
        if (Array.isArray(invoiceRes)) {
          const formatted = invoiceRes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map((inv) => ({
              ...inv,
              points: `₹${Number(inv.amount || 0).toLocaleString("en-IN")}`,
              time: new Date(inv.createdAt).toLocaleDateString("en-IN"),
            }));
          setActivities(formatted);
        }

        const cafeRes = await getCafes();
        if (Array.isArray(cafeRes)) {
          const random = cafeRes.sort(() => 0.5 - Math.random()).slice(0, 3);
          setCafes(random);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const quickActions = [
    {
      icon: <Search className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-4 text-[#4A3A2F]" strokeWidth={1.5} />,
      title: "Find Cafes",
      link: "/user/cafes",
    },
    {
      icon: <Heart className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-4 text-[#4A3A2F]" strokeWidth={1.5} />,
      title: "Wishlist",
      link: "/user/cafes",
    },
    {
      icon: <Users className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-4 text-[#4A3A2F]" strokeWidth={1.5} />,
      title: "Invite",
      link: "/user/rewards#referral-section",
    },
    {
      icon: <Gift className="w-6 h-6 md:w-10 md:h-10 mx-auto mb-2 md:mb-4 text-[#4A3A2F]" strokeWidth={1.5} />,
      title: "Redeem",
      link: "/user/claim-reward",
    },
  ];

  const workflowSteps = [
    {
      title: "Join & Check-In",
      desc: "Sign up and check in at partner cafes to start collecting CashPoints.",
      icon: <Search className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 text-[#4A3A2F]" strokeWidth={1.5} />
    },
    {
      title: "Refer & Earn",
      desc: "Share your referral code. You and your friends earn bonus points.",
      icon: <Users className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 text-[#4A3A2F]" strokeWidth={1.5} />
    },
    {
      title: "Redeem Rewards",
      desc: "Use your CashPoints to pay for coffee, food, and more.",
      icon: <Gift className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 text-[#4A3A2F]" strokeWidth={1.5} />
    },
  ];

  const animatedMessages = [
    "Discover amazing cafes !!",
    "Earn rewards with every sip",
    "Your loyalty, rewarded.",
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white text-[#4A3A2F] pt-16 md:pt-0">
      
      {/* === Hero Section (Compact for Mobile) === */}
      <section className="relative py-12 md:py-24 bg-gradient-to-br from-[#4A3A2F] via-[#3B2D25] to-[#2A1F18] overflow-hidden">
        <AnimatedBalls />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 md:mb-6">Welcome to CafeChain</h1>
          <AnimatedHeaderSubtitle lines={animatedMessages} />

          <div className="inline-block max-w-md mx-auto mb-8 md:mb-10">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 text-[#4a3a2f]">
              <div className="flex items-center">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 flex items-center justify-center rounded-2xl mr-4 md:mr-6">
                  <Coffee className="w-8 h-8 md:w-12 md:h-12 text-[#4a3a2f]" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm text-gray-500">Your XP</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold">{points.toLocaleString()}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <Link to="/user/cafes" className="flex flex-col md:flex-row items-center justify-center gap-2 bg-white px-4 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-lg hover:bg-gray-50 shadow-lg transition-colors">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2} />
              <span>Find Cafes</span>
            </Link>
            <Link to="/user/claim-reward" className="flex flex-col md:flex-row items-center justify-center gap-2 bg-amber-600 text-white px-4 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-lg hover:bg-amber-700 shadow-lg transition-colors">
              <Gift className="w-5 h-5 md:w-10 md:h-10 text-white" strokeWidth={2} />
              <span>Redeem</span>
            </Link>
          </div>
        </div>
      </section>

      {/* === Quick Actions (Compact Grid) === */}
      <motion.section className="py-8 md:py-16" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">What would you like to do?</h2>
          {/* Reduced gap and padding for mobile */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6" variants={cardContainerVariants}>
            {quickActions.map((action, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <Link to={action.link} className="block bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  {action.icon}
                  <h3 className="font-bold text-sm md:text-lg">{action.title}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* === Dynamic Global Announcement Section === */}
      <GlobalAnnouncementBanner />

      {/* === Upcoming Events Section === */}
      <UpcomingEvents />

      {/* === Featured Cafes === */}
      <motion.section className="py-10 md:py-20 bg-white" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-6">Featured Cafes</h2>
            <p className="text-sm md:text-xl text-gray-600">Discover amazing coffee experiences</p>
          </div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8" variants={cardContainerVariants}>
            {cafes.length > 0 ? (
              cafes.map((cafe) => (
                <motion.div key={cafe._id} variants={cardVariants}>
                  <CafeCard cafe={cafe} onClick={() => (window.location.href = `/user/cafes/${cafe._id}`)} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-3">No cafes available at the moment.</p>
            )}
          </motion.div>
          <div className="text-center mt-8 md:mt-12">
            <Link to="/user/cafes" className="px-6 py-3 md:px-8 md:py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 shadow-lg text-sm md:text-lg">See All Cafes</Link>
          </div>
        </div>
      </motion.section>

      {/* === How It Works === */}
      <motion.section
        className="py-10 md:py-20 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">How CashPoints Works</h2>
            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto">
              Start earning rewards in three simple steps
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            variants={cardContainerVariants}
          >
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                variants={cardVariants}
              >
                <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full border-4 border-[#4A3A2F] flex items-center justify-center">
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#4A3A2F] text-white flex items-center justify-center text-xs md:text-sm font-bold">
                    {idx + 1}
                  </div>
                  {React.cloneElement(step.icon, { className: "w-8 h-8 md:w-12 md:h-12 text-[#4A3A2F]" })}
                </div>

                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* === Recent Activity === */}
      <motion.section
        className="py-10 md:py-16 bg-gray-50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 border border-gray-100">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">Recent Activity</h2>
              <Link
                to="/user/rewards#recent-activity"
                className="px-4 py-2 md:px-6 md:py-3 bg-[#4A3A2F] text-white rounded-full font-semibold text-sm md:text-base shadow-lg hover:bg-opacity-90 transition-colors"
              >
                View All
              </Link>
            </div>

            {activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity._id || index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 border rounded-xl bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="font-bold text-base md:text-lg text-[#4a3a2f] truncate">
                          {activity?.cafe?.name || "A Cafe"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity?.time}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 text-[10px] md:text-xs font-semibold rounded-full capitalize ${activity?.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : activity?.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {activity?.status || "Pending"}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Amount:{" "}
                        <span className="font-semibold text-base text-[#4a3a2f]">
                          {activity?.points}
                        </span>
                      </div>
                      {activity?.invoiceUrl && (
                        <a
                          href={activity.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-amber-600 hover:underline"
                        >
                          View Invoice
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No recent activity found.</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* === Final Call to Action === */}
      <motion.section 
        // INCREASED BOTTOM PADDING TO PREVENT CUTOFF ON MOBILE
        className="pt-12 pb-28 md:py-20 bg-[#4A3A2F]" 
        variants={sectionVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Ready to Start Earning?</h2>
          <p className="text-base md:text-xl text-amber-200 mb-8 md:mb-12">Join CafeChain today and transform every coffee purchase into valuable rewards.</p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Link to="/user/cafes" className="bg-white px-8 py-3 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:bg-gray-100 shadow-xl text-[#4A3A2F] transition-transform hover:scale-105 flex items-center justify-center gap-3">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2} />
              <span>Explore</span>
            </Link>
            <Link to="/user/rewards" className="bg-amber-600 text-white px-8 py-3 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:bg-amber-700 shadow-xl transition-transform hover:scale-105 flex items-center justify-center gap-3">
              <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2} />
              <span>Redeem</span>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;