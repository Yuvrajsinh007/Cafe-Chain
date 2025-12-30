// RewardsPage.jsx (Redesigned with original backend functionality)

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
// import { getProfile, getRewardsHistory } from '../api/api';
import { getProfile, getInvoiceHistory } from '../api/api';
import { FileText, ExternalLink } from 'lucide-react'; // already had some icons
import { Share2, Award, Users, Star, ChevronDown, Copy, Check, UploadCloud } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader'; // 1. Loader component imported

// A reusable card component for displaying key stats.
const StatCard = ({ icon, title, value, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        // Reduced padding (p-4) and rounded corners (rounded-xl) for mobile compactness
        className="rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm flex flex-col items-center justify-center transition-all cursor-pointer bg-stone-50 border border-stone-200 h-full"
        onClick={onClick}
    >
        <div className="mb-2 md:mb-3 text-[#4A3A2F]">{icon}</div>
        {/* Scaled down text for mobile */}
        <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#4A3A2F]">{value}</p>
        <p className="text-xs md:text-sm font-semibold mt-1 text-gray-600">{title}</p>
    </motion.div>
);

const RewardsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [rewardsData, setRewardsData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllHistory, setShowAllHistory] = useState(false);
    const [copied, setCopied] = useState(false);
    const location = useLocation();

    // 1. useEffect for data fetching (remains the same)
    useEffect(() => {
        const fetchRewardsData = async () => {
            if (authLoading) return;
            
            if (!user || !user.phone) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }
            try {
                const [profileRes, invoiceRes] = await Promise.all([
                    getProfile(user.phone),
                    getInvoiceHistory(),
                    new Promise(resolve => setTimeout(resolve, 1000)) // Min 1s load time
                ]);
                const pointsEarned = profileRes.points.reduce((total, p) => total + p.totalPoints, 0);
                setRewardsData({
                    pointsEarned: pointsEarned,
                    xpPoints: profileRes.xp,
                    referredCount: profileRes.referralChildren.length,
                    referralCode: profileRes.referralCode
                });
                setHistoryData(invoiceRes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error("Failed to fetch rewards data:", err);
                setError("Failed to load rewards data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRewardsData();
    }, [user, authLoading]);
    
    // 2. New useEffect for scrolling logic
    useEffect(() => {
        // Only run this effect if not in a loading state and the hash is present
        if (!loading && location.hash === '#referral-section') {
            const element = document.getElementById('referral-section');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100); 
            }
        }

        if (!loading && location.hash === '#recent-activity') {
            const element = document.getElementById('recent-activity');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100); 
            }
        }
    }, [loading, location.hash]);


    // Animation Variants for scroll-triggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const handleShareReferral = async () => {
        if (!rewardsData?.referralCode) return;
        const shareText = `Hey! Join me on CafeChain and earn bonus points. Use my referral code: ${rewardsData.referralCode}`;
        if (navigator.share) {
            await navigator.share({ title: 'Join Our CafeChain Club!', text: shareText, url: window.location.origin }).catch(console.error);
        } else {
            await navigator.clipboard.writeText(shareText).catch(console.error);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClaimReward = () => navigate('/user/claim-reward');
    const displayedHistory = showAllHistory ? historyData : historyData.slice(0, 3);

    if (loading) {
        return <Loader />; 
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-lg font-semibold text-red-600">{error}</div>;
    }

    if (!rewardsData) {
        return <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-500">No rewards data available.</div>;
    }

    return (
        // Reduced bottom padding (pb-20) and top padding (pt-16) for mobile nav
        <div className="min-h-screen bg-white text-[#4A3A2F] font-sans pb-20 pt-16 md:pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Page Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="mb-6 md:mb-10 text-center"
                >
                    <h1 className="text-2xl md:text-4xl font-bold mb-2">Your Rewards Dashboard</h1>
                    <p className="text-sm md:text-lg text-gray-500">Track your points, referrals, and claim amazing rewards.</p>
                </motion.div>

                {/* Stats Grid - Using grid-cols-2 on mobile for compactness */}
                <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Responsive Icon Sizes (w-6 h-6 on mobile, w-8 h-8 on desktop) */}
                    <motion.div variants={itemVariants}>
                        <StatCard icon={<UploadCloud className="w-6 h-6 md:w-8 md:h-8" />} title="Claim Reward" value="Claim" onClick={handleClaimReward} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatCard icon={<Star className="w-6 h-6 md:w-8 md:h-8" />} title="Total Points" value={rewardsData.pointsEarned} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatCard icon={<Award className="w-6 h-6 md:w-8 md:h-8" />} title="XP Points" value={rewardsData.xpPoints} />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatCard icon={<Users className="w-6 h-6 md:w-8 md:h-8" />} title="Total Referrals" value={rewardsData.referredCount} />
                    </motion.div>
                </motion.div>

                {/* Referral Code Section */}
                <motion.div 
                    id="referral-section"  
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    // Reduced padding for mobile
                    className="bg-stone-50 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-stone-200 mb-6 md:mb-10"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-lg md:text-xl font-bold mb-1">Share & Earn More</h2>
                            <p className="text-xs md:text-base text-gray-500">Share your unique code with friends to earn bonus points together!</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-dashed border-stone-300 rounded-lg p-2 md:p-3 w-full md:w-auto">
                           <span className="font-mono text-base md:text-lg font-bold text-[#4A3A2F] flex-grow text-center">{rewardsData.referralCode}</span>
                           <button onClick={handleShareReferral} className="p-2 md:p-3 bg-[#4A3A2F] text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
                               <AnimatePresence mode="wait">
                                   <motion.div key={copied ? 'check' : 'copy'} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                       {copied ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                                   </motion.div>
                               </AnimatePresence>
                           </button>
                        </div>
                    </div>
                </motion.div>

                {/* History Section */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="bg-stone-50 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-stone-200"
                >
                    <motion.h2 id="recent-activity" variants={itemVariants} className="text-lg md:text-xl font-bold mb-4 md:mb-6">Recent Activity</motion.h2>
                    {displayedHistory.length > 0 ? (
                        <div className="space-y-3 md:space-y-4">
                            <AnimatePresence initial={false}>
                                {displayedHistory.map((c) => (
                                    <motion.div key={c._id} variants={itemVariants} initial="hidden" animate="visible" exit="hidden"
                                    className="p-3 md:p-4 bg-white rounded-lg border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm md:text-base text-[#4a3a2f]">{c?.cafe?.name || "Cafe"}</p>
                                            <p className="text-xs md:text-sm text-gray-500">
                                                Uploaded on {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                            <p className="text-xs md:text-sm mt-0.5 md:mt-1">
                                                Amount: <span className="font-semibold">₹{Number(c.amount || 0).toLocaleString("en-IN")}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                            <span
                                                className={`px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold rounded-full ${
                                                    c.status === "approved" ? "bg-green-100 text-green-700"
                                                    : c.status === "rejected" ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {c.status?.charAt(0).toUpperCase() + c.status?.slice(1) || "Pending"}
                                            </span>
                                            {c.invoiceUrl && (
                                                <a 
                                                    href={c.invoiceUrl} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-[#4a3a2f] px-2 py-1.5 md:px-3 md:py-2 rounded-lg md:rounded-xl border border-stone-300 hover:bg-stone-100 transition"
                                                >
                                                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                                                    View Invoice
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.p variants={itemVariants} className="text-center text-gray-500 py-6 md:py-8 text-sm">No invoice activity yet.</motion.p>
                    )}
                    {historyData.length > 3 && (
                        <motion.div variants={itemVariants} className="text-center mt-4 md:mt-6">
                            <button onClick={() => setShowAllHistory(!showAllHistory)} className="font-semibold text-sm md:text-base text-[#4A3A2F] hover:underline flex items-center gap-1 mx-auto">
                                {showAllHistory ? 'Show Less' : 'Show All Activity'}
                                <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${showAllHistory ? 'rotate-180' : ''}`} />
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default RewardsPage;