import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import { useState, useEffect } from "react";
import logo from "../assets/cc.png";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";

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

  const hideNavbar =
    location.pathname.includes("/cafe/auth") ||
    location.pathname.includes("/cafe/dashboard");

  if (hideNavbar) return null;

  const isHome = ["/", "/cafe/", "/cafe"].includes(location.pathname);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" 
        : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link
            to="auth/login"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-amber-200 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img
                src={logo}
                alt="CafeChain Logo"
                className="relative h-10 w-10 rounded-xl shadow-sm object-cover"
                />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-amber-700 transition-colors">
              CafeChain
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isHome && (
              <Link
                to="/cafe/dashboard"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#4A3A2F] hover:bg-[#3b2d24] shadow-lg shadow-amber-900/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-64 opacity-100 border-b border-gray-100" : "max-h-0 opacity-0"
        } bg-white`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {isHome && (
            <Link
              to="/cafe/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-amber-50 text-amber-800 font-bold"
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;