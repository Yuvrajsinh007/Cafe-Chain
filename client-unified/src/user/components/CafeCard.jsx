import React from "react";
import { MapPin, Phone } from "lucide-react";

const CafeCard = ({ cafe, onClick }) => {
  const handleImgError = (e) => {
    if (!e.target.src.includes("logo.jpg")) {
      e.target.src = "/assets/Images/logo.jpg"; // fallback
    }
  };

  return (
    <div
      className="
        bg-white rounded-xl md:rounded-2xl shadow-soft cursor-pointer hover:shadow-lg transition-shadow
        flex flex-col h-full w-full overflow-hidden
      "
      onClick={() => onClick && onClick(cafe)}
    >
      {/* Image section: Reduced height on mobile (h-32) */}
      <div className="w-full h-32 md:h-40 flex-shrink-0">
        <img
          src={cafe.images?.[0]?.url ?? "/assets/Images/logo.jpg"}
          alt={cafe.name}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      </div>

      {/* Details section: Reduced padding on mobile */}
      <div className="flex flex-col flex-1 p-3 md:p-4">
        <div>
          <h3 className="font-semibold text-dark-brown text-base md:text-lg mb-1 truncate">
            {cafe.name}
          </h3>

          <div className="flex items-center text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{cafe.address || "Unknown address"}</span>
          </div>

          <div className="flex items-center text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
            <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
            <span>{cafe.cafePhone || "N/A"}</span>
          </div>
        </div>

        {/* Features section pushed to the bottom */}
        <div className="mt-auto pt-1 md:pt-2" style={{ minHeight: '32px' }}>
          {cafe.features?.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-2">
              {cafe.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-light-gray text-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs truncate max-w-[80px] md:max-w-[100px]"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;