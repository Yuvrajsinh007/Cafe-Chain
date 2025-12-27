
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../store/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getActiveEvents } from '../../api/api';
import { FaWhatsapp } from 'react-icons/fa'; // <-- Added for WhatsApp logo

const PRIMARY = '#4a3a2f';
const ACCENT1 = '#25D366'; // WhatsApp green
const ACCENT2 = '#FFD93D';
const LIGHT_BG = '#ffffff'; // white background
const SHAPE_COLORS = ['#FFB6B9', '#6BCB77', '#4D96FF', '#FFD93D'];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.8 } },
  hover: { scale: 1.03, boxShadow: `0 20px 40px rgba(0,0,0,0.1)` },
};

export default function AdsEventsPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { user, isLoading: isContextLoading } = state;

  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getActiveEvents();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user?._id && filter === 'my_cafe') {
      setFilteredEvents(allEvents.filter(event => event.cafe?._id === user._id));
    } else {
      setFilteredEvents(allEvents);
    }
  }, [filter, allEvents, user]);

  if (isContextLoading || isLoading) return <Loader />;

  return (
    <div className="min-h-screen font-sans bg-white relative overflow-hidden">
      {/* Floating decorative shapes */}
      {SHAPE_COLORS.map((color, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${30 + idx * 10}px`,
            height: `${30 + idx * 10}px`,
            backgroundColor: color,
            top: `${10 + idx * 20}%`,
            left: `${20 + idx * 15}%`,
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4 + idx, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      ))}

      <header className="p-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-lg font-semibold hover:scale-105 transition-transform
                    border-none outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:outline-none"
          style={{ color: PRIMARY, background: "transparent" }}
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <a
          href="https://wa.me/917575825782?text=Hello%20CafeChain%2C%20We%20are%20interested%20to%20post%20an%20event%20or%20ads!
"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          style={{ backgroundColor: ACCENT1, color: 'white' }}
        >
          <FaWhatsapp size={20} /> {/* WhatsApp icon added */}
          Book Your Ads & Events
        </a>
      </header>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-5xl font-extrabold mb-10"
        style={{ background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)', WebkitBackgroundClip: 'text', color: 'transparent' }}
      >
        Ads & Events
      </motion.h1>

      {/* Event Cards */}
      <div className="container mx-auto px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredEvents.length > 0 ? filteredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              className="rounded-3xl shadow-lg overflow-hidden cursor-pointer relative flex flex-col bg-white border border-gray-100 h-full"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              style={{ minHeight: '480px' }} // Make all cards roughly same height
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-400 to-yellow-300 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md z-10">
                {event.type || 'Event'}
              </div>
              <img
                src={event.image || "/assets/Images/logo.jpg"}
                alt={event.name || 'Event Image'}
                className="h-56 w-full object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-2" style={{ color: ACCENT1 }}>
                  {event.name || "Untitled Event"}
                </h2>
                <p className="text-gray-700 flex-grow">{event.description || "No description available."}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" style={{ color: ACCENT2 }} />
                    <span>
                      {event.date 
                        ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : "Date not specified" }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2" style={{ color: ACCENT2 }} />
                    <span>{event.time || "Time not specified"}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2" style={{ color: ACCENT2 }} />
                    {event.cafe ? (
                      <Link to={`/user/cafes/${event.cafe._id}`} className="hover:underline" style={{ color: ACCENT1 }}>
                        <span>{event.cafe.name}</span>
                      </Link>
                    ) : (
                      <span className="text-gray-500">Cafe not specified</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 col-span-full text-lg"
            >
              No events found.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
