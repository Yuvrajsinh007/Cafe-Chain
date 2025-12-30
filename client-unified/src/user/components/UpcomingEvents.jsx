import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { getActiveEvents } from "../api/api";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import "./UpcomingEvents.css";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationDuration, setAnimationDuration] = useState("30s");
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const activeEvents = await getActiveEvents();
        if (activeEvents.length > 0) {
          setEvents([...activeEvents, ...activeEvents]); // desktop marquee
          const secondsPerEvent = 4;
          const totalDuration = activeEvents.length * secondsPerEvent;
          setAnimationDuration(`${totalDuration}s`);
        }
      } catch (error) {
        console.error("Could not fetch upcoming events.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Mobile auto-slide effect
  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (events.length / 2)); 
    }, 5000); 
    return () => clearInterval(interval);
  }, [events]);

  if (loading || events.length === 0) {
    return null;
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      // Reduced vertical padding on mobile (py-8 vs py-16)
      className="py-8 md:py-16 bg-gray-50 overflow-x-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Scaled down heading and icon for mobile */}
        <h2 className="flex items-center justify-center gap-2 md:gap-3 text-2xl md:text-4xl font-bold text-center mb-6 md:mb-12 text-[#4A3A2F]">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 text-amber-600" /> Upcoming Events
        </h2>

        {/* Desktop Marquee */}
        <div className="relative w-full overflow-hidden mask-image hidden md:block">
          <div
            className="flex animate-marquee gap-8 whitespace-nowrap py-4"
            style={{ animationDuration }}
          >
            {events.map((event, index) => (
              <div key={`${event._id}-${index}`} className="flex-shrink-0 w-80">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel - Reduced container width */}
        <div className="relative w-full overflow-hidden block md:hidden px-4">
          <motion.div
            key={currentIndex} 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center py-2"
          >
            <div className="flex-shrink-0 w-full max-w-sm">
              <EventCard event={events[currentIndex]} />
            </div>
          </motion.div>
          
          {/* Optional: Simple Dots Indicator for Mobile */}
          <div className="flex justify-center gap-1.5 mt-4">
            {events.slice(0, events.length / 2).map((_, idx) => (
              <div 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  idx === currentIndex ? "bg-[#4A3A2F]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UpcomingEvents;