import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import { useState, useEffect } from "react";
import logo from "../assets/cc.png";

function Navbar() {
  const { state } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar on login, register, and dashboard pages
  const hideNavbar =
    location.pathname.includes("/cafe/auth") ||
    location.pathname.includes("/cafe/dashboard");

  if (hideNavbar) return null; // completely hide navbar on those pages

  const isHome =
    location.pathname === "/" ||
    location.pathname === "/cafe/" ||
    location.pathname === "/cafe";

  const handleLogout = () => {
    if (state.logout) state.logout();
    navigate("/cafe/auth/login", { replace: true });
  };

  const buttonClasses = (from, to) =>
    `px-5 py-2 rounded-full text-base font-semibold text-gray-700
     bg-gradient-to-r from-${from} to-${to} shadow-md
     hover:from-${from === "yellow-200" ? "yellow-300" : "amber-300"}
     hover:to-${to === "yellow-400" ? "yellow-500" : "amber-500"}
     hover:scale-105 hover:shadow-lg transition-all duration-300
     focus:outline-none focus:ring-0 active:outline-none`;

  return (
    <nav
      className={`sticky top-0 z-10 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-white/80 shadow-lg" : "bg-white shadow-md"
      }`}
      style={{
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="auth/login"
            className="flex items-center group focus:outline-none focus:ring-0 active:outline-none"
          >
            <img
              src={logo}
              alt="CafeChain Logo"
              className="h-9 w-9 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span className="ml-3 text-2xl font-extrabold text-gray-900 tracking-wide group-hover:text-primary transition-colors duration-300">
              CafeChain
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isHome && (
              <Link
                to="/cafe/dashboard"
                className={buttonClasses("yellow-200", "yellow-400")}
              >
                Dashboard
              </Link>
            )}
            { /*<button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full text-base font-semibold text-white bg-red-500 shadow-md hover:bg-red-600 hover:scale-105 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
            >
              Logout
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-0 active:outline-none transition-all duration-300"
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden bg-white/90 backdrop-blur-md transition-all duration-300`}
      >
        <div className="px-2 pt-2 pb-3 space-y-3 border-t border-gray-200 flex flex-col">
          {isHome && (
            <Link
              to="/cafe/dashboard"
              className={buttonClasses("yellow-200", "yellow-400")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
       
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
