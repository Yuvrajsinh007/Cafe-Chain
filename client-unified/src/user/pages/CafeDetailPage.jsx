import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getCafeById, getOffersByCafeId } from "../api/api";
import Loader from "../components/Loader";

const CafeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [offers, setOffers] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // slider states
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = 
  (cafe?.images && cafe.images.length > 0) 
  ? cafe.images.map(img => img.url) 
  : ['/assets/Images/logo.jpg']; // Fallback image

  useEffect(() => {
    const fetchCafeData = async () => {
      setLoading(true);
      try {
        // Fetch both cafe details and offers at the same time
        const [cafeData, offersData] = await Promise.all([
          getCafeById(id),
          getOffersByCafeId(id)
        ]);

        setCafe(cafeData);
        setOffers(offersData);

        const favs = JSON.parse(localStorage.getItem("favourites")) || [];
        setIsLiked(favs.includes(cafeData._id));

      } catch (error) {
        console.error("Error fetching cafe data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCafeData();
  }, [id]);

  // slider auto change
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleBack = () => navigate("/user/cafes");

  const toggleLike = () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    if (!isLiked) {
      favourites.push(cafe._id);
    } else {
      favourites = favourites.filter((cid) => cid !== cafe._id);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
    setIsLiked(!isLiked);
  };

  const handleImgError = (e) => {
    if (!e.target.src.includes("logo.jpg")) {
      e.target.src = "/assets/Images/logo.jpg";
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const renderSpecialOffers = () => (
    <div className="bg-gradient-to-r from-[#4a3a2f]/10 to-[#4a3a2f]/5 rounded-3xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-dark-brown mb-6">Special Offers</h3>
      {offers.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {offers.map((offer, index) => (
            <div key={offer._id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
              <span className="bg-[#4a3a2f] text-white w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-lg font-bold">
                {index + 1}
              </span>
              <p className="text-gray-800 text-base font-medium flex-grow">
                {offer.name} {/* <-- Use real offer name */}
              </p>
              <span className="ml-auto text-base font-semibold text-[#4a3a2f]">
                {offer.pointsRequired} pts {/* <-- Use real points */}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No special offers available at the moment.</p>
      )}
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  if (!cafe) {
    return (
      <div className="flex items-center justify-center h-screen">
          <p>Cafe not found.</p>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0 font-['Inter'] md:bg-gray-100 pt-20 md:pt-0">
      <div className="px-4 pt-4 md:max-w-7xl md:mx-auto md:px-8">
        <button
          onClick={handleBack}
          className="text-base font-semibold text-gray-600 hover:text-dark-brown transition-colors focus:outline-none focus:ring-0 border-none"
        >
          &larr; Back
        </button>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="px-4 py-6 space-y-6 relative">
          {/* Slider */}
          <div className="bg-light-gray rounded-2xl h-48 overflow-hidden relative">
            <img
              src={images[currentIndex]}
              alt={cafe.name}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-in-out"
              onError={handleImgError}
            />

            {images.length > 1 && (
              <>
                {/* Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* View Menu and Like Buttons */}
          <div className="flex items-center justify-between mr-1 ml-2">
            {/* <button
              onClick={() => alert("Menu tab clicked!")}
              className="p-3 rounded-xl bg-[#4a3a2f] text-white hover:bg-amber-500 transition-colors"
            >
              View Menu
            </button> */}
            <button
              onClick={toggleLike}
              className={`p-3 rounded-xl transition-colors ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-light-gray text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
            <h1 className="text-2xl font-bold text-dark-brown">{cafe.name}</h1> 

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{cafe.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{cafe.cafePhone || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{cafe.openingHours || "N/A"}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-brown mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {cafe.features?.length > 0 ? (
                  cafe.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-light-gray text-gray-700 px-3 py-1 rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags available</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-dark-brown mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-h-40 overflow-y-auto">
                {cafe?.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Special Offers Section - Mobile */}
          <div className="mt-6">
            {renderSpecialOffers()}
          </div>

        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="md:max-w-7xl md:mx-auto md:px-8 md:py-8">
          <div className="grid grid-cols-2 gap-8 items-start bg-white p-8 rounded-2xl shadow-soft relative">
            {/* Slider */}
            <div className="bg-light-gray rounded-2xl h-96 overflow-hidden relative">
              <img
                src={images[currentIndex]}
                alt={cafe.name}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-in-out"
                onError={handleImgError}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-dark-brown">{cafe.name}</h1>
                <div className="flex items-center gap-4">
                  {/* <button
                    onClick={() => alert("Menu tab clicked!")}
                    className="p-2 rounded-lg bg-[#4a3a2f] text-white hover:bg-amber-500 transition-colors text-sm"
                  >
                    View Menu
                  </button> */}
                  <button
                    onClick={toggleLike}
                    className={`p-2 rounded-lg transition-colors ${
                      isLiked
                        ? "bg-red-50 text-red-500"
                        : "bg-light-gray text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">{cafe.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">{cafe.cafePhone || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-700">{cafe.openingHours || "N/A"}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-dark-brown mb-2 text-xl">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cafe.features?.length > 0 ? (
                    cafe.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-light-gray text-gray-700 px-3 py-1 rounded-lg text-sm"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No tags available</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-dark-brown mb-2 text-xl">
                  Description
                </h3>
                <p className="text-gray-600 text-base leading-relaxed max-h-48 overflow-y-auto">
                  {cafe?.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offers Section - Desktop */}
        <div className="mt-8 md:max-w-7xl md:mx-auto md:px-8">
          {renderSpecialOffers()}
        </div>
        
      </div>
    </div>
  );
};

export default CafeDetailPage;
