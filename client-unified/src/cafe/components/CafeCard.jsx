import React from "react";
import { MapPin, Phone, Star } from "lucide-react";

const CafeCard = ({ cafe, onClick }) => {
  const handleImgError = (e) => {
    if (!e.target.src.includes("logo.jpg")) {
      e.target.src = "/assets/Images/logo.jpg";
    }
  };

  return (
    <div
      className="group bg-white rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full w-full"
      onClick={() => onClick && onClick(cafe)}
    >
      {/* Image section */}
      <div className="relative w-full h-48 flex-shrink-0 overflow-hidden">
        <img
          src={cafe.images?.[0]?.url ?? "/assets/Images/logo.jpg"}
          alt={cafe.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImgError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        
        {/* Optional Rating Badge (if available in future) */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-gray-800">4.5</span>
        </div>
      </div>

      {/* Details section */}
      <div className="flex flex-col flex-1 p-5">
        <div>
          <h3 className="font-bold text-gray-800 text-xl mb-1 truncate group-hover:text-amber-700 transition-colors">
            {cafe.name}
          </h3>

          <div className="flex items-center text-gray-500 text-sm mb-1.5">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-600" />
            <span className="truncate">{cafe.address || "Unknown address"}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-4">
            <Phone className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-600" />
            <span>{cafe.cafePhone || "N/A"}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-auto pt-3 border-t border-gray-50">
          {cafe.features?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {cafe.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide truncate max-w-[100px] border border-amber-100"
                >
                  {feature}
                </span>
              ))}
              {cafe.features.length > 3 && (
                  <span className="text-xs text-gray-400 py-1 self-center">+{cafe.features.length - 3}</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">No features listed</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;