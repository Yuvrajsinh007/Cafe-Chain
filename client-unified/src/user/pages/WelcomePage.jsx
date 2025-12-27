import React, { useState, useEffect } from "react";
import { 
  Coffee, 
  Gift, 
  Users, 
  Trophy, 
  ChevronRight, 
  Plane,
  Star,
  CheckCircle,
  Heart,
  Zap,
  CreditCard,
  MapPin,
  TrendingUp,
  Award,
  UserPlus,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";



// Animated Background Balls Component
const AnimatedBalls = () => {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none pt-20 md:pt-0">
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

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Testimonial Card Component
const TestimonialCard = ({ name, rating, comment }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
  >
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={16} className="text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 mb-4 italic">"{comment}"</p>
    <p className="font-semibold text-[#4A3A2F]">- {name}</p>
  </motion.div>
);

// Animated Hero Text Component
const AnimatedHeroText = () => {
    const sentences = [
        "Transform every coffee purchase into points.",
        "Discover amazing cafes and unlock exclusive rewards.",
        "Experience our revolutionary loyalty program."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        }, 4000); // Change sentence every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-24 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                >
                    {sentences[index]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// Animated CTA Text Component
const AnimatedCTAText = () => {
    const sentences = [
        "Ready to Revolutionize Your Coffee Experience?",
        "Join Thousands of Happy Coffee Lovers.",
        "Start Earning With Every Single Sip."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-28 md:h-40 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
                <motion.h2
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl"
                >
                    {sentences[index]}
                </motion.h2>
            </AnimatePresence>
        </div>
    );
};


// Main Landing Page Component
export default function CafeChainLanding() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/user/login');
  };

  // SEO optimized content data
  const features = [
    { 
      icon: <MapPin size={28} />, 
      title: "Discover Premium Cafes", 
      desc: "Find the best coffee spots in your city with our curated selection of partner cafes." 
    },
    { 
      icon: <CreditCard size={28} />, 
      title: "Instant Rewards", 
      desc: "Earn points immediately with every purchase and redeem them for free coffee and treats." 
    },
    { 
      icon: <TrendingUp size={28} />, 
      title: "Exclusive Benefits", 
      desc: "Access member-only discounts, early access to new menu items, and special events." 
    },
    { 
      icon: <UserPlus size={28} />, 
      title: "Referral Program", 
      desc: "Invite friends and earn bonus points when they join and make their first purchase." 
    }
  ];

  const steps = [
    { 
      num: 1, 
      icon: <Smartphone size={32} />,
      title: "Download & Sign Up", 
      desc: "Create your free CafeChain account in seconds and start your coffee journey with us." 
    },
    { 
      num: 2, 
      icon: <Coffee size={32} />,
      title: "Visit Partner Cafes", 
      desc: "Check in at any of our 500+ partner locations and earn points with every purchase." 
    },
    { 
      num: 3, 
      icon: <Gift size={32} />,
      title: "Redeem & Enjoy", 
      desc: "Use your accumulated points for free coffee, pastries, and exclusive member rewards." 
    }
  ];

  const stats = [
    { number: 50000, label: "Happy Members", suffix: "+" },
    { number: 500, label: "Partner Cafes", suffix: "+" },
    { number: 1000000, label: "Rewards Redeemed", suffix: "+" },
    { number: 98, label: "Satisfaction Rate", suffix: "%" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "I've saved over $200 on coffee this year! CafeChain has completely changed how I enjoy my daily coffee ritual."
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "The app helped me discover amazing local cafes I never knew existed. Plus, the rewards are fantastic!"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      comment: "Being part of CafeChain feels like joining an exclusive coffee community. Love the member benefits!"
    }
  ];

  const benefits = [
    "Free coffee after every 10th purchase",
    "Birthday month special discounts",
    "Early access to seasonal menu items",
    "Exclusive member-only events",
    "No expiration on reward points",
    "Mobile ordering with skip-the-line privilege"
  ];

  return (
    <div className="bg-white min-h-screen w-full font-sans text-[#4A3A2F] overflow-x-hidden">
      {/* SEO Meta Tags would go here in a real implementation */}
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <Coffee size={28} className="text-[#4A3A2F]" />
              <span className="text-2xl font-bold text-[#4A3A2F]">CafeChain</span>
            </div>
            
         <div className="flex items-center gap-2 sm:gap-3">
  {/* Mobile: Icon button */}
  <button
    onClick={handleNavigation}
    className="p-2 rounded-full hover:bg-gray-50 transition-colors sm:hidden"
  >
    <Users size={22} className="text-[#4A3A2F]" />
  </button>

  {/* Desktop: Text button */}
  <button 
    onClick={handleNavigation} 
    className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors hidden sm:block"
  >
    Sign In
  </button>

  <button 
    onClick={handleNavigation} 
    className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold bg-[#4A3A2F] text-white rounded-full hover:bg-[#4A3A2F]/90 transition-all transform hover:scale-105 shadow-lg"
  >
    Get Started
  </button>
</div>

          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Animated Background */}
        <section className="relative pt-32 pb-24 min-h-screen flex items-center bg-[#4A3A2F] overflow-hidden">
          <AnimatedBalls />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Your Coffee Journey,
                <br />
                <span className="text-white/80">Perfectly Rewarded</span>
              </h1>
              
              <AnimatedHeroText />

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button 
                onClick={handleNavigation}
                className="bg-white text-[#4A3A2F] px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 min-w-[200px]"
              >
                Start Earning Points
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={handleNavigation}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#4A3A2F] transition-all transform hover:scale-105"
              >
                Watch Demo
              </button>
            </motion.div>
            
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#4A3A2F] mb-6">
                Why Choose CafeChain?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of coffee loyalty with features designed to enhance every aspect of your coffee journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4A3A2F] text-white rounded-full mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-[#4A3A2F]">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#4A3A2F] mb-6">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of coffee enthusiasts who are already earning rewards with every sip.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-20">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-[#4A3A2F] text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#4A3A2F] text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#4A3A2F]">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{step.desc}</p>
                  {index < steps.length - 1 && (
                    <>
                      {/* Desktop Arrow */}
                      <ChevronRight size={24} className="hidden md:block absolute top-1/2 left-full -translate-y-1/2 text-gray-300 ml-1" />
                      {/* Mobile Arrow */}
                      <svg className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-6 text-gray-300" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-12"
            >
              <button 
                onClick={handleNavigation}
                className="bg-[#4A3A2F] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#4A3A2F]/90 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Journey Today
              </button>
            </motion.div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-24 bg-[#4A3A2F] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/8 rounded-full"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <Zap size={64} className="text-white mx-auto mb-8" />
              <AnimatedCTAText />
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join the CafeChain community today. Your perfect cup is just a tap away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleNavigation}
                  className="bg-white text-[#4A3A2F] px-10 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all transform hover:scale-105 shadow-xl"
                >
                  Join CafeChain Now
                </button>
                <button 
                  onClick={handleNavigation}
                  className="border-2 border-white text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#4A3A2F] transition-all"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Coffee size={28} className="text-[#4A3A2F]" />
            <span className="text-2xl font-bold text-[#4A3A2F]">CafeChain</span>
          </div>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Connecting coffee lovers with their favorite cafes through innovative loyalty rewards.
          </p>
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500">
              &copy; {new Date().getFullYear()} CafeChain. All rights reserved. Made with ❤️ for coffee lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

