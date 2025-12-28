import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import { getDashboardAnalytics } from "../../api/api";
import Loader from "../../components/Loader";
import { 
  LogOut, 
  Menu, 
  LayoutDashboard, 
  BarChart2, 
  Gift, 
  Megaphone, 
  History, 
  Tags, 
  User, 
  Mail,
  TrendingUp,
  Users
} from "lucide-react";

function Dashboard() {
  const { state, dispatch } = useAppContext();
  const { cafeInfo } = state;
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await getDashboardAnalytics();
        setMetrics({
          daily: {
            sales: 0,
            newCustomers: response.data.totalCustomerVisits || 0,
            redemptions: response.data.pointsRedeemedToday || 0,
          },
        });
      } catch (error) {
        console.error("Failed to fetch dashboard analytics:", error);
        setMetrics({ daily: { sales: 0, newCustomers: 0, redemptions: 0 } });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("cafeToken");
    navigate("/cafe/auth/login", { replace: true });
  };

  const navLinks = [
    { to: "/cafe", label: "Home", icon: LayoutDashboard },
    { to: "/cafe/dashboard/metrics", label: "Metrics", icon: BarChart2 },
    { to: "/cafe/dashboard/redemption", label: "Redemption", icon: Gift },
    { to: "/cafe/dashboard/ads-events", label: "Ads & Events", icon: Megaphone },
    { to: "/cafe/dashboard/activity", label: "Activity Log", icon: History },
    { to: "/cafe/dashboard/offers", label: "Manage Offers", icon: Tags },
    { to: "/cafe/dashboard/profile", label: "Profile & Settings", icon: User },
    { to: "/cafe/dashboard/contactus", label: "Contact Us", icon: Mail },
  ];

  if (isLoading) return <Loader />;

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row font-sans text-gray-800">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-30">
        <h2 className="text-xl font-extrabold text-[#4A3A2F] tracking-tight">
          CafeChain
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A3A2F]/20"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-gray-200 z-30 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-8 border-b border-gray-100 hidden lg:block">
          <h2 className="text-2xl font-black text-[#4A3A2F] tracking-tight">
            CafeChain
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium truncate">{cafeInfo?.name}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-[#4A3A2F]/5 hover:text-[#4A3A2F] font-medium transition-all group"
            >
              <link.icon className="w-5 h-5 text-gray-400 group-hover:text-[#4A3A2F] transition-colors" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-semibold transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
        
        {/* Welcome Header */}
        <header className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A3A2F] mb-2">
              Welcome back, {cafeInfo?.name}
            </h1>
            <p className="text-gray-500 font-medium">
              {cafeInfo?.address || "Manage your cafe performance and rewards."}
            </p>
          </div>
        </header>

        {/* Stats Overview */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" /> Today's Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Stat Card 1 */}
            <div className="bg-gradient-to-br from-[#4A3A2F] to-[#3B2D25] text-white rounded-2xl p-6 shadow-lg shadow-[#4A3A2F]/20 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Gift className="w-24 h-24" />
              </div>
              <p className="text-amber-200/80 text-sm font-bold uppercase tracking-wider mb-1">Points Redeemed</p>
              <p className="text-4xl font-black mb-4">{metrics?.daily?.redemptions}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm border border-white/10">
                <span>Today's Total</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white text-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:border-amber-200 transition-colors">
              <div className="absolute right-4 top-4 p-2 bg-green-50 rounded-lg text-green-600">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Visits</p>
              <p className="text-4xl font-black mb-4 text-[#4A3A2F]">{metrics?.daily?.newCustomers}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                <span>All Time</span>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { to: "/cafe/dashboard/metrics", label: "View Metrics", desc: "Detailed analytics", icon: BarChart2, color: "text-blue-600 bg-blue-50" },
              { to: "/cafe/dashboard/redemption", label: "Redeem Rewards", desc: "Scan & verify", icon: Gift, color: "text-purple-600 bg-purple-50" },
              { to: "/cafe/dashboard/ads-events", label: "Ads & Events", desc: "Promote your cafe", icon: Megaphone, color: "text-orange-600 bg-orange-50" },
              { to: "/cafe/dashboard/activity", label: "Activity Log", desc: "Transaction history", icon: History, color: "text-emerald-600 bg-emerald-50" },
            ].map((action, idx) => (
              <Link
                key={idx}
                to={action.to}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#4A3A2F] transition-colors">{action.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

export default Dashboard;