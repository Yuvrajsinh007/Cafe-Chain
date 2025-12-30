import React, { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CafeCard from "../components/CafeCard";
import Loader from "../components/Loader";
import { getCafes } from "../api/api";

const AnimatedSubtitle = ({ lines }) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prevIndex) => (prevIndex + 1) % lines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [lines.length]);

  const lineVariants = {
    animate: { transition: { staggerChildren: 0.03 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  };

  const charVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  return (
    <div className="h-10 md:h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          className="text-xs md:text-lg text-gray-500 max-w-3xl mx-auto px-4"
          variants={lineVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {lines[lineIndex].split("").map((char, index) => (
            <motion.span
              key={index}
              variants={charVariants}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const CafesPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [cafes, setCafes] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const cafesPerPage = 5;
  const navigate = useNavigate();

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const data = await getCafes();
        setCafes(data);
      } catch (error) {
        console.error("Failed to fetch cafes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCafes();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    const lowerCaseQuery = searchQuery.toLowerCase();

    let cafesToFilter = cafes;
    if (activeTab === "favourite") {
      const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
      cafesToFilter = cafes.filter((cafe) => favourites.includes(cafe._id));
    }

    const searchFiltered = cafesToFilter.filter((cafe) =>
      cafe.name.toLowerCase().includes(lowerCaseQuery) ||
      cafe.address.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredCafes(searchFiltered);
    setCurrentPage(1); // reset page when filters change
  }, [cafes, activeTab, searchParams]);

  const subtitleLines = [
    "Explore our curated collection of unique cafes.",
    "Your next favorite spot is just a scroll away.",
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);

    if (tab === "favourite") {
      const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
      const favCafes = cafes.filter((cafe) => favourites.includes(cafe._id));
      setFilteredCafes(favCafes);
    } else {
      setFilteredCafes(cafes);
    }
  };

  useEffect(() => {
    if (activeTab === "favourite") {
      const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
      const favCafes = cafes.filter((cafe) => favourites.includes(cafe._id));
      setFilteredCafes(favCafes);
    }
  }, [activeTab, cafes]);

  const handleCafeClick = (cafe) => {
    navigate(`/user/cafes/${cafe._id}`);
  };

  if (loading) {
    return <Loader />;
  }

  // Slice cafes for mobile pagination
  const pagedCafes = isMobile
    ? filteredCafes.slice((currentPage - 1) * cafesPerPage, currentPage * cafesPerPage)
    : filteredCafes;

  const totalPages = isMobile ? Math.ceil(filteredCafes.length / cafesPerPage) : 1;

  return (
    // Reduced padding top from pt-20 to pt-16 for mobile
    <div className="w-full min-h-screen bg-white flex flex-col items-center pb-24 text-[#4a3a2f] pt-16 md:pt-0">
      <div className="w-full max-w-7xl px-4 py-4 md:py-6">
        {/* Compact Header Section */}
        <motion.div
          className="text-center my-6 md:my-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-5xl font-bold mb-2">
            Find Your Perfect Coffee
          </h1>
          <AnimatedSubtitle lines={subtitleLines} />
        </motion.div>

        {/* Compact Tabs */}
        <div className="flex justify-center w-full mb-6 md:mb-12">
          <div className="relative flex bg-gray-100 rounded-full p-1 w-full max-w-[250px] md:max-w-xs">
            <button
              onClick={() => handleTabChange("all")}
              className={`relative flex-1 py-2 md:py-3 px-3 md:px-4 rounded-full text-xs md:text-base font-medium z-10 transition-colors ${
                activeTab === "all" ? "text-[#4a3a2f]" : "text-gray-500"
              }`}
            >
              All Cafes
            </button>
            <button
              onClick={() => handleTabChange("favourite")}
              className={`relative flex-1 py-2 md:py-3 px-3 md:px-4 rounded-full text-xs md:text-base font-medium z-10 transition-colors ${
                activeTab === "favourite" ? "text-[#4a3a2f]" : "text-gray-500"
              }`}
            >
              Favourite
            </button>
            <motion.div
              className="absolute top-1 bottom-1 h-auto bg-white rounded-full shadow-md"
              initial={false}
              animate={{
                left: activeTab === "all" ? "4px" : "50%",
                right: activeTab === "favourite" ? "4px" : "50%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.45 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {pagedCafes.length > 0 ? (
            <motion.div
              key={activeTab + searchParams.get("search") + currentPage}
              // Reduced gap on mobile from gap-6 to gap-4
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {pagedCafes.map((cafe, index) => (
                <motion.div
                  key={cafe._id}
                  variants={index < 4 ? itemVariants : {}}
                  initial={index < 4 ? "hidden" : false}
                  animate={index < 4 ? "visible" : false}
                  transition={index < 4 ? { type: "spring", stiffness: 100 } : {}}
                >
                  <CafeCard cafe={cafe} onClick={() => handleCafeClick(cafe)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-cafes"
              className="text-center py-10 md:py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center">
                <Coffee className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#4a3a2f] mb-2">
                No Cafes Found
              </h3>
              <p className="text-sm md:text-base text-gray-500">
                {activeTab === "favourite"
                  ? "You haven't added any favourites yet!"
                  : "Check back later for new and exciting cafes."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Pagination for mobile */}
        {isMobile && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${
                  currentPage === i + 1 ? "bg-[#4a3a2f] text-white" : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CafesPage;