// components/MobileNavbar.jsx
import React from "react";
import { useState, useEffect } from "react";
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
            {/* This style tag ensures the "Playfair Display" font is available.
              It's the same one used in the main navbar for consistency.
            */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
                    .font-logo {
                        font-family: 'Playfair Display', serif;
                    }
                `}
            </style>

            {/* This motion.nav provides a smooth slide-down animation when the component loads.
              It's designed to be sticky at the top of the screen only on mobile (md:hidden).
            */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="md:hidden bg-white/80 backdrop-blur-md shadow-sm fixed top-0 z-50 w-full"
            >
                <div className="px-4 py-3 flex items-center justify-between h-20">
                    {/* Logo with link to home page */}
                    <div className="flex-shrink-0 focus:outline-none focus:ring-0 border-none">
                        <Link to="/user/home" className="text-2xl font-bold text-[#4A3A2F] font-logo focus:outline-none focus:ring-0 border-none">
                            CafeChain
                        </Link>
                    </div>

                    {/* The search and profile icons will only appear if the user is authenticated. */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-3 flex-1 ml-3 focus:outline-none focus:ring-0 border-none">
                            {/* Redesigned Search Bar */}
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-full focus:outline-none focus:ring-0 border-none">
                                <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-full focus:outline-none focus:ring-0 border-none">
                                <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 focus:outline-none focus:ring-0 border-none" />
                                <input
                                    type="text"
                                    placeholder="Search cafes..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="bg-transparent outline-none text-sm w-full focus:outline-none focus:ring-0 border-none"
                                />
                                </form>
                            </div>
                            
                            {/* Redesigned Profile Icon */}
                            <button
                                className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#4A3A2F] rounded-full text-white font-bold overflow-hidden focus:outline-none focus:ring-0 border-none"
                                onClick={() => navigate("/user/profile")}
                                aria-label="Go to profile"
                            >
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-semibold">
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
 