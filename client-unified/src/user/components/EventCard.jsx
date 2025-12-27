// src/components/EventCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Info } from 'lucide-react';

const EventCard = ({ event }) => {
  // Format the main event date
  const formattedEventDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ✅ ADDED: Format the 'createdAt' date to show when the event was posted
  const formattedPostedDate = new Date(event.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col h-full w-full overflow-hidden border border-gray-200 relative">
      
      {/* ✅ ADDED: Status Badge in the top-right corner */}
      {event.status === 'active' && (
        <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full z-10">
          Active
        </div>
      )}

      {/* Image section */}
      <div className="w-full h-40 flex-shrink-0">
        <img
          src={event.image || "/assets/Images/logo.jpg"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details section */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-[#4A3A2F] text-lg mb-2 pr-16">
          {event.name}
        </h3>

        {/* ✅ UPDATED: Longer description snippet */}
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
        </p>

        {/* Date & Time */}
        <div className="flex items-center text-gray-700 text-sm mb-2 font-medium">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-amber-700" />
          <span>{formattedEventDate}</span>
          <span className="mx-2">|</span>
          <Clock className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-700" />
          <span>{event.time}</span>
        </div>
        
        {/* ✅ UPDATED: Location now includes the cafe's address */}
        <div className="flex items-start text-gray-600 text-sm mt-auto pt-3 border-t">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-amber-700" />
          <div>
            {/* The Link now only wraps the cafe name */}
            {event.cafe ? (
            <Link to={`/user/cafes/${event.cafe._id}`}>
              <p className="font-semibold truncate text-gray-800 hover:underline hover:text-amber-800 transition-colors">
                {event.cafe.name}
              </p>
            </Link>
          ) : (
            <p className="font-semibold text-gray-500">Cafe info not available</p>
          )}
          <p className="text-xs truncate">
            {event.cafe?.address || "Address not available"}
          </p>
          </div>
        </div>

        {/* ✅ ADDED: "Posted On" date using createdAt */}
        <div className="flex items-center text-gray-400 text-xs mt-2">
            <Info className="w-3 h-3 mr-1.5" />
            <span>Posted: {formattedPostedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;