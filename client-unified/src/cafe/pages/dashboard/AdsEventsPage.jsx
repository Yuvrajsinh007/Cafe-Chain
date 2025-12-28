import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../store/AppContext';
import { ArrowLeft, Calendar, Clock, MapPin, Search, Filter } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { getActiveEvents } from '../../api/api';
import { FaWhatsapp } from 'react-icons/fa';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
        console.error("Failed to fetch events");
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
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-12 font-sans relative overflow-hidden">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] transition-colors font-medium"
            >
                <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <a
                href="https://wa.me/917575825782?text=Hello%20CafeChain%2C%20We%20are%20interested%20to%20post%20an%20event%20or%20ads!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold shadow-lg shadow-green-500/20 hover:bg-[#20bd5a] hover:-translate-y-0.5 transition-all"
            >
                <FaWhatsapp className="w-5 h-5" />
                Book Ads & Events
            </a>
        </div>

        <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-[#4A3A2F] tracking-tight mb-2">
                Discover Events
            </h1>
            <p className="text-lg text-gray-500">Explore exclusive promotions and gatherings.</p>
        </div>
      </div>

      {/* Filters (Optional Placeholder for Future Logic) */}
      <div className="max-w-7xl mx-auto mb-10 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button 
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === 'all' ? 'bg-[#4A3A2F] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
        >
            All Events
        </button>
        {user && (
            <button 
                onClick={() => setFilter('my_cafe')}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === 'my_cafe' ? 'bg-[#4A3A2F] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
            >
                My Events
            </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative h-60 overflow-hidden">
                    <img
                        src={event.image || "/assets/Images/logo.jpg"}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-[#4A3A2F] shadow-sm">
                        {event.type || 'Event'}
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {event.name}
                    </h2>
                    
                    <div className="space-y-3 mb-6 flex-grow">
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="space-y-2 border-t border-gray-50 pt-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            {event.date ? new Date(event.date).toLocaleDateString() : "Date TBA"}
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-amber-500" />
                            {event.time || "Time TBA"}
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            {event.cafe ? (
                                <Link to={`/user/cafes/${event.cafe._id}`} className="hover:text-[#4A3A2F] hover:underline transition-colors truncate">
                                    {event.cafe.name}
                                </Link>
                            ) : <span>Location TBA</span>}
                        </div>
                    </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-20 text-center text-gray-400"
            >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-lg font-medium">No events found</p>
                <p className="text-sm">Check back later for updates.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}