import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, AlertCircle } from "lucide-react";
import { getAnnouncements } from "../api/api";

const GlobalAnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnnouncements();
        // If data exists, use it. Otherwise fallback to defaults if you want, or show nothing.
        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
            // Optional: Fallback defaults if DB is empty
           setAnnouncements([]); 
        }
      } catch (error) {
        console.error("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate logic
  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [announcements.length]);

  if (loading || announcements.length === 0) return null;

  const currentItem = announcements[currentIndex];

  return (
    <motion.section
      className="py-3 bg-[#4A3A2F] border-b border-amber-900/50"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-3">
        {/* <Megaphone className="w-6 h-6 text-amber-400 shrink-0 hidden md:block" /> */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shadow-sm border border-white/5">
            <Megaphone className="w-5 h-5 text-amber-400" strokeWidth={2} />
          </div>
          
          <div className="relative w-full max-w-2xl overflow-hidden text-center h-8 md:h-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem._id || currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full flex flex-col md:flex-row items-center justify-center gap-2"
              >
                <span className="text-amber-200 font-bold uppercase text-sm md:text-base tracking-wide">
                  {currentItem.title}:
                </span>
                <span className="text-white text-sm md:text-base font-medium truncate max-w-xs md:max-w-full">
                  {currentItem.body}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Pagination Dots (Optional, for visual cue) */}
        {announcements.length > 1 && (
            <div className="flex justify-center gap-1 mt-1">
                {announcements.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-amber-400 w-3' : 'bg-gray-600'}`}
                    />
                ))}
            </div>
        )}
      </div>
    </motion.section>
  );
};

export default GlobalAnnouncementBanner;