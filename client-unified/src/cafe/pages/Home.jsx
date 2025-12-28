import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import { getAllCafes } from '../api/api';
import CafeCard from '../../user/components/CafeCard'; // Ensure this path is correct for your structure
import Pagination from '../components/Pagination';
import { toast } from 'sonner';
import { Megaphone, Store, Coffee, ArrowRight, LogIn } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const StyledCard = ({ children, className = '' }) => (
  <motion.div
    variants={fadeIn}
    className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

function Home() {
  const { state, dispatch } = useAppContext();
  const { isAuthenticated, cafeInfo, announcements, partnerCafes } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cafesPerPage = 4;

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await getAllCafes();
        dispatch({ type: 'SET_PARTNER_CAFES', payload: response.data });
      } catch (error) {
        toast.error("Failed to fetch partner cafes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCafes();
  }, [dispatch]);

  // Pagination logic
  const indexOfLastCafe = currentPage * cafesPerPage;
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage;
  const currentCafes = partnerCafes.slice(indexOfFirstCafe, indexOfLastCafe);
  const totalPages = Math.ceil(partnerCafes.length / cafesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <Loader />;

  // === Unauthenticated View ===
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#FDFBF7] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#4A3A2F 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg shadow-amber-900/5 mb-8">
             <Coffee className="w-10 h-10 text-[#4A3A2F]" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extralight leading-tight tracking-tight text-[#4A3A2F]">
            Cafe<span className="font-bold text-amber-600">Chain</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Elevating cafe loyalty and community. Connect your cafe to a network of premium hospitality and rewards.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/cafe/auth/register"
                className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-[#4A3A2F] text-white shadow-xl shadow-amber-900/10 hover:bg-[#3b2d24] transition-all"
              >
                Join the Network <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/cafe/auth/login"
                className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl bg-white text-[#4A3A2F] border-2 border-[#4A3A2F]/10 hover:border-[#4A3A2F]/30 hover:bg-gray-50 transition-all shadow-sm"
              >
                <LogIn className="w-5 h-5" /> Partner Login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // === Authenticated View ===
  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Header */}
        <motion.div variants={fadeIn} className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 pb-8">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extralight text-[#4A3A2F]">
              Welcome back, <span className="font-bold block mt-1">{cafeInfo?.name}</span>
            </h2>
            <p className="mt-3 text-lg text-gray-500 font-light">
              Your hub for connection and growth.
            </p>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Date</p>
             <p className="text-xl font-medium text-[#4A3A2F]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Announcements */}
          <StyledCard className="lg:col-span-1 h-fit">
            <div className="p-6 bg-gradient-to-br from-[#4A3A2F] to-[#3B2D25] text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <Megaphone className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold">Announcements</h3>
                </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <motion.article
                    key={announcement.id}
                    variants={fadeIn}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-amber-50/50 hover:border-amber-100 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                          announcement.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {announcement.priority === 'high' ? 'Important' : 'Update'}
                      </span>
                      <time className="text-xs text-gray-400">
                        {new Date(announcement.date).toLocaleDateString()}
                      </time>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-[#4A3A2F] transition-colors">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {announcement.content}
                    </p>
                  </motion.article>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <Megaphone className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No new announcements.</p>
                </div>
              )}
            </div>
          </StyledCard>

          {/* Right Column: Partner Cafes */}
          <StyledCard className="lg:col-span-2">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <Store className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Partner Network</h3>
                        <p className="text-xs text-gray-500">Discover other cafes in the chain</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentCafes.map((cafe) => (
                    <CafeCard key={cafe._id} cafe={cafe} />
                ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
          </StyledCard>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;