import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Gift, Users, Trophy, ChevronRight } from "lucide-react";
import { FaInstagram, FaEnvelope, FaFacebook } from "react-icons/fa";
import { motion } from 'framer-motion';

// --- Reusable AnimatedHeaderSubtitle from HomePage for consistency ---
const AnimatedHeaderSubtitle = ({ lines }) => {
    const [lineIndex, setLineIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLineIndex((prevIndex) => (prevIndex + 1) % lines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [lines.length]);

    const lineVariants = {
        animate: { transition: { staggerChildren: 0.03 } },
    };
    const charVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 200 } },
    };

    return (
        <div className="text-xl md:text-2xl font-medium text-amber-200 mb-10 min-h-[3rem]">
            <motion.p key={lineIndex} variants={lineVariants} initial="initial" animate="animate">
                {lines[lineIndex].split('').map((char, index) => (
                    <motion.span key={index} variants={charVariants} style={{ display: 'inline-block' }}>
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </motion.p>
        </div>
    );
};

// --- Main WelcomePage Component ---
export default function WelcomePage() {
    const navigate = useNavigate();

    // Data for sections
    const features = [
        { icon: <Coffee size={28} />, title: "Discover Cafes", desc: "Find unique spots near you." },
        { icon: <Gift size={28} />, title: "Earn Rewards", desc: "Get points for every visit." },
        { icon: <Trophy size={28} />, title: "Join Contests", desc: "Compete on the leaderboard." },
        { icon: <Users size={28} />, title: "Refer Friends", desc: "Earn bonus points together." }
    ];

    const steps = [
        { num: 1, title: "Join & Check-In", desc: "Sign up and check in at partner cafes to start collecting points." },
        { num: 2, title: "Refer & Earn", desc: "Share your code so you and your friends earn bonus points." },
        { num: 3, title: "Redeem Rewards", desc: "Use your points to pay for coffee, food, and more." }
    ];
    
    // Animation Variants
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };
    const cardContainerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="bg-white min-h-screen w-full font-sans text-[#4A3A2F] pt-20 md:pt-0">
            {/* 1. Header Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <span className="text-2xl font-bold">CafeChain</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/user/login')} className="px-5 py-2 text-sm font-semibold rounded-full hover:bg-gray-100 transition">Login</button>
                            <button onClick={() => navigate('/user/register')} className="px-5 py-2 text-sm font-semibold bg-[#4A3A2F] text-white rounded-full hover:bg-opacity-90 transition">Register</button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* 2. Hero Section */}
                <section className="relative pt-32 pb-24 bg-gradient-to-br from-[#4A3A2F] via-[#3B2D25] to-[#2A1F18] overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                    <div className="relative max-w-7xl mx-auto px-4 text-center">
                        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                            Your Loyalty, Rewarded.
                        </motion.h1>
                        <AnimatedHeaderSubtitle lines={["Discover amazing cafes.", "Earn rewards with every sip."]} />
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <button onClick={() => navigate('/user/register')} className="bg-amber-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition shadow-lg transform hover:scale-105">
                                Join the Club
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* 3. Features Section */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need for Your Coffee Journey</h2>
                        <motion.div variants={cardContainerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, i) => (
                                <motion.div variants={cardVariants} key={i} className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                                    <div className="inline-block p-4 bg-amber-100 text-amber-600 rounded-full mb-4">{feature.icon}</div>
                                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* 4. How It Works Section */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Simple Steps</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Turn your coffee routine into a rewarding experience.</p>
                        </div>
                        <motion.div variants={cardContainerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {steps.map((step) => (
                                <motion.div variants={cardVariants} key={step.num} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold bg-[#4A3A2F] text-white">{step.num}</div>
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* 5. Visual CTA Section */}
                <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="bg-stone-100 rounded-2xl grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden">
                            <div className="p-10 lg:p-16">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock a World of Coffee</h2>
                                <p className="text-gray-600 text-lg mb-6">Join a community of coffee lovers. Discover exclusive cafes, get member-only deals, and make every cup count towards a delicious reward.</p>
                                <button onClick={() => navigate('/user/cafes')} className="font-bold text-lg text-[#4A3A2F] flex items-center gap-2 hover:gap-3 transition-all">
                                    Explore Cafes <ChevronRight />
                                </button>
                            </div>
                            <div className="h-64 lg:h-full w-full">
                                <img src="/assets/Images/cafe-interior.jpg" alt="Cozy cafe interior" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* 6. Footer */}
            <footer className="bg-[#4A3A2F] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Join CafeChain Today</h2>
                    <p className="text-amber-200 mb-8">Ready to turn your coffee passion into points?</p>
                    <button onClick={() => navigate('/user/register')} className="bg-white text-[#4A3A2F] px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-lg">Get Started Now</button>
                    <div className="flex justify-center gap-6 my-10 text-2xl">
                        <a href="#" aria-label="Instagram" className="hover:text-amber-300 transition"><FaInstagram /></a>
                        <a href="#" aria-label="Email" className="hover:text-amber-300 transition"><FaEnvelope /></a>
                        <a href="#" aria-label="Facebook" className="hover:text-amber-300 transition"><FaFacebook /></a>
                    </div>
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} CafeChain. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}