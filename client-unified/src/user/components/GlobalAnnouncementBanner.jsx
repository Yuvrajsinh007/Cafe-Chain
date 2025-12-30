import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone } from "lucide-react";
import { getAnnouncements } from "../api/api";

const GlobalAnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnnouncements();
        if (data && data.length > 0) {
          setAnnouncements(data);
        } else {
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
      className="py-4 bg-[#4A3A2F] border-b border-amber-900/50 w-full"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4">
        {/* Main Layout: Column in ALL views (Icon Top, Text Bottom) */}
        <div className="flex flex-col items-center justify-center gap-2">
          
          {/* Component 1: Icon (Centered) */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shadow-sm border border-white/5">
            <Megaphone className="w-5 h-5 text-amber-400" strokeWidth={2} />
          </div>
          
          {/* Component 2: Announcement Text (Centered) */}
          {/* Fixed height to accommodate 2 lines of text without layout shift during animation */}
          <div className="relative w-full max-w-3xl overflow-hidden h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem._id || currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full flex flex-col items-center justify-center text-center"
              >
                {/* Title */}
                <span className="text-amber-200 font-bold uppercase text-xs md:text-sm tracking-wide mb-0.5">
                  {currentItem.title}
                </span>
                {/* Body */}
                <span className="text-white text-xs md:text-sm font-medium px-4 truncate w-full">
                  {currentItem.body}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
        
        {/* Pagination Dots */}
        {announcements.length > 1 && (
            <div className="flex justify-center gap-1 mt-2">
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