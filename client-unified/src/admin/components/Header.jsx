import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { 
  Bell, 
  LogOut, 
  User, 
  Store, 
  MessageSquare, 
  CreditCard, 
  X,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
// Import your API functions
import { 
  adminGetPendingCafes, 
  getContactSubmissions, 
  adminGetPendingClaims 
} from "../api/api";

export default function Header() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // 1. Fetch Data from all sources
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [cafes, messages, claims] = await Promise.all([
        adminGetPendingCafes().catch(() => []),
        getContactSubmissions().catch(() => []),
        adminGetPendingClaims().catch(() => [])
      ]);

      const newNotifs = [];

      // Process Pending Cafes
      cafes.forEach(cafe => {
        newNotifs.push({
          id: `cafe-${cafe._id}`,
          type: 'approval',
          icon: Store,
          color: 'text-orange-500 bg-orange-50',
          title: 'New Cafe Approval',
          message: `${cafe.name} registered and is waiting for review.`,
          time: new Date(cafe.createdAt),
          link: '/pithad/cafes/approval-queue'
        });
      });

      // Process Messages (Showing latest 5 to avoid clutter if many)
      messages.slice(0, 5).forEach(msg => {
        newNotifs.push({
          id: `msg-${msg._id}`,
          type: 'message',
          icon: MessageSquare,
          color: 'text-blue-500 bg-blue-50',
          title: 'New Inquiry',
          message: `${msg.username}: ${msg.subject.substring(0, 30)}...`,
          time: new Date(msg.createdAt),
          link: '/pithad/contact-submissions'
        });
      });

      // Process Claims
      claims.forEach(claim => {
        newNotifs.push({
          id: `claim-${claim._id}`,
          type: 'claim',
          icon: CreditCard,
          color: 'text-green-500 bg-green-50',
          title: 'Reward Redemption',
          message: `${claim.user?.name || 'User'} claimed ₹${claim.amount}`,
          time: new Date(claim.createdAt || Date.now()), // Fallback if createdAt missing
          link: '/pithad/invoices'
        });
      });

      // Sort by newest first
      newNotifs.sort((a, b) => b.time - a.time);

      setNotifications(newNotifs);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Poll every 60 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (link) => {
    setShowDropdown(false);
    navigate(link);
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm sticky top-0 z-30">
      {/* Left Side: Welcome Text */}
      <div className="flex flex-col">
         <h2 className="text-xl font-bold text-gray-800">Welcome back, Admin</h2>
         <p className="text-sm text-gray-500">Here is what’s happening today.</p>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-6">
        
        {/* === Notification Bell === */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative p-2 rounded-xl transition-all ${
              showDropdown ? 'bg-amber-50 text-amber-600' : 'text-gray-400 hover:text-amber-600 hover:bg-gray-50'
            }`}
          >
             <Bell className="w-6 h-6" />
             {notifications.length > 0 && (
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
             )}
          </button>

          {/* === Dropdown Menu === */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  {notifications.length} New
                </span>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Checking updates...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleNotificationClick(item.link)}
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group flex gap-4 items-start"
                      >
                        <div className={`p-2 rounded-lg shrink-0 mt-1 ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                              {formatDistanceToNow(item.time, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 self-center opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-50 bg-gray-50/30 text-center">
                <button 
                  onClick={() => setShowDropdown(false)}
                  className="text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
             <div className="font-bold text-gray-700 text-sm">{admin?.name || "Administrator"}</div>
             <div className="text-xs text-amber-600 font-medium">Super Admin</div>
          </div>
          
          <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 border-2 border-amber-50">
            <User className="w-5 h-5" />
          </div>

          <button
            onClick={logout}
            className="ml-2 p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}