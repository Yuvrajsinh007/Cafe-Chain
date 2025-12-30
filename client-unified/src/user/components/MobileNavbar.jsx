import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNavbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/user/cafes") {
            setSearchQuery(searchParams.get("search") || "");
        } else {
            setSearchQuery("");
        }
    }, [searchParams, location.pathname]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (location.pathname === "/user/cafes") {
            if (value.trim()) {
                setSearchParams({ search: value });
            } else {
                setSearchParams({});
            }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (location.pathname !== "/user/cafes") {
                navigate(`/user/cafes?search=${searchQuery}`);
            } else {
                setSearchParams({ search: searchQuery });
            }
        }
    };

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
                    .font-logo {
                        font-family: 'Playfair Display', serif;
                    }
                `}
            </style>

            {/* Reduced height from h-20 to h-16 (64px) for better mobile fit */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="md:hidden bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50 w-full border-b border-stone-100"
            >
                <div className="px-4 flex items-center justify-between h-16 gap-3">
                    {/* Logo */}
                    <div className="flex-shrink-0 focus:outline-none focus:ring-0 border-none">
                        <Link to="/user/home" className="text-xl font-bold text-[#4A3A2F] font-logo focus:outline-none focus:ring-0 border-none tracking-tight">
                            CafeChain
                        </Link>
                    </div>

                    {/* Search & Profile */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-3 flex-1 justify-end focus:outline-none focus:ring-0 border-none min-w-0">
                            
                            {/* Improved Search Bar Styling */}
                            <div className="flex-1 max-w-[220px] relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-stone-400 group-focus-within:text-[#4A3A2F] transition-colors" />
                                </div>
                                <form onSubmit={handleSearchSubmit} className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="block w-full pl-9 pr-3 py-2 border border-stone-200 rounded-full leading-5 bg-stone-50 text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#4A3A2F] focus:ring-1 focus:ring-[#4A3A2F] sm:text-sm transition-all duration-200 shadow-sm"
                                    />
                                </form>
                            </div>
                            
                            {/* Slightly smaller profile icon (w-8 h-8) */}
                            <button
                                className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#4A3A2F] rounded-full text-white font-bold overflow-hidden shadow-sm hover:shadow-md transition-shadow ring-2 ring-stone-100"
                                onClick={() => navigate("/user/profile")}
                                aria-label="Go to profile"
                            >
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-xs font-semibold">
                                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </motion.nav>
        </>
    );
};

export default MobileNavbar;