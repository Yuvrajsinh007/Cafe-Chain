import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Search } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const navLinks = [
    { name: "Home", href: "/user/home" },
    { name: "Cafes", href: "/user/cafes" },
    { name: "Leaderboard", href: "/user/leaderboard" },
    { name: "Rewards", href: "/user/rewards" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const currentSearchParam = searchParams.get("search") || "";
        if (searchQuery !== currentSearchParam) {
            setSearchQuery(currentSearchParam);
        }
    }, [searchParams]);

    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setSearchQuery(newQuery);

        if (location.pathname === "/user/cafes") {
            if (newQuery) {
                setSearchParams({ search: newQuery });
            } else {
                setSearchParams({});
            }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (location.pathname !== "/user/cafes") {
            navigate(`/user/cafes?search=${searchQuery}`);
        } else {
            if (searchQuery) {
                setSearchParams({ search: searchQuery });
            } else {
                setSearchParams({});
            }
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const menuVariants = {
        hidden: { opacity: 0, y: '-100%' },
        visible: { opacity: 1, y: '0%', transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
        exit: { opacity: 0, y: '-100%', transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
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

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0">
                            <Link to="/user/home" className="text-3xl font-bold text-[#4A3A2F] font-logo focus:outline-none focus:ring-0 border-none">
                                CafeChain
                            </Link>
                        </div>

                        {isAuthenticated && (
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4 relative">
                                    {navLinks.map((link) => (
                                        <div key={link.name} className="relative">
                                            <Link
                                                to={link.href}
                                                className="text-gray-600 hover:text-[#4A3A2F] px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 border-none"
                                            >
                                                {link.name}
                                            </Link>
                                            {location.pathname === link.href && (
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A3A2F]"
                                                    layoutId="underline"
                                                    initial={false}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isAuthenticated && (
                            <div className="hidden md:flex items-center gap-4">
                                <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                                    <Search className="w-5 h-5 text-gray-400 mr-2 " />
                                    <input
                                        type="text"
                                        placeholder="Search cafes..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="bg-transparent outline-none text-sm w-32 transition-all focus:w-40 focus:outline-none focus:ring-0 border-none"
                                    />
                                </form>
                                <button
                                    className="w-10 h-10 flex items-center justify-center bg-[#4A3A2F] rounded-full text-white font-bold overflow-hidden focus:outline-none focus:ring-0 border-none"
                                    onClick={() => navigate("/user/profile")}
                                    aria-label="Go to profile"
                                >
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-semibold ">
                                            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {isAuthenticated && (
                            <div className="-mr-2 flex md:hidden">
                                <button
                                    onClick={toggleMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-white hover:bg-[#4A3A2F] focus:outline-none focus:ring-0 border-none"
                                >
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && isAuthenticated && (
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="md:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 pt-20"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={toggleMenu}
                                        className={`block px-3 py-4 rounded-md text-2xl font-medium ${
                                            location.pathname === link.href
                                                ? 'text-white bg-[#4A3A2F]'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <form onSubmit={handleSearchSubmit} className="flex justify-center items-center py-4 px-3">
                                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
                                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Search cafes..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="bg-transparent outline-none text-sm w-full"
                                        />
                                    </div>
                                </form>
                                <div className="pt-8">
                                    <button
                                        onClick={() => { navigate("/user/profile"); toggleMenu(); }}
                                        className="p-4 bg-gray-100 rounded-full text-gray-500 hover:bg-[#4A3A2F] hover:text-white transition-colors"
                                    >
                                        <User className="h-8 w-8" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Navbar;
