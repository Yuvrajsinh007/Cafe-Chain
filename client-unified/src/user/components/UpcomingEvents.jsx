import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { getActiveEvents } from "../api/api";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import "./UpcomingEvents.css"; // Import the CSS for the marquee effect

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationDuration, setAnimationDuration] = useState("30s");
  const [currentIndex, setCurrentIndex] = useState(0); // for mobile carousel

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
      setCurrentIndex((prev) => (prev + 1) % (events.length / 2)); // Use original length
    }, 5000); // 5 seconds
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
      className="py-16 bg-gray-50 overflow-x-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="flex items-center justify-center gap-3 text-4xl font-bold text-center mb-12 text-[#4A3A2F]">
          <Calendar className="w-8 h-8 text-amber-600" /> Upcoming Events
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

        {/* Mobile Carousel */}
        <div className="relative w-full overflow-hidden block md:hidden">
          <motion.div
            key={currentIndex} // re-trigger animation when index changes
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center py-4"
          >
            <div className="flex-shrink-0 w-[90vw] max-w-sm">
              <EventCard event={events[currentIndex]} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default UpcomingEvents;