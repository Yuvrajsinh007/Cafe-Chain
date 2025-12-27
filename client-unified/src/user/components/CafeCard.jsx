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
        bg-white rounded-2xl shadow-soft cursor-pointer hover:shadow-lg transition-shadow
        flex flex-col h-full w-full overflow-hidden
      "
      onClick={() => onClick && onClick(cafe)}
    >
      {/* Image section */}
      <div className="w-full h-40 flex-shrink-0">
        <img
          src={cafe.images?.[0]?.url ?? "/assets/Images/logo.jpg"}
          alt={cafe.name}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      </div>

      {/* Details section */}
      <div className="flex flex-col flex-1 p-4">
        <div>
          <h3 className="font-semibold text-dark-brown text-lg mb-1 truncate">
            {cafe.name}
          </h3>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{cafe.address || "Unknown address"}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{cafe.cafePhone || "N/A"}</span>
          </div>
        </div>

        {/* Features section pushed to the bottom */}
        <div className="mt-auto pt-2" style={{ minHeight: '40px' }}>
          {cafe.features?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cafe.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-light-gray text-gray-700 px-2 py-1 rounded-lg text-xs truncate max-w-[100px]"
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