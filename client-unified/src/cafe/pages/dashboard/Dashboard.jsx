import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import { getDashboardAnalytics } from "../../api/api";
import Loader from "../../components/Loader";
import { LogOut, Menu } from "lucide-react";

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
            newCustomers: response.data.totalCustomerVisits,
            redemptions: response.data.pointsRedeemedToday,
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

  if (isLoading) return <Loader />;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-white shadow-md p-4 sticky top-0 z-30">
        <h2 className="text-xl font-extrabold" style={{ color: "#4a3a2f" }}>
          CafeChain
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Sidebar */}
 {/* Sidebar */}
<aside
  className={`fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg z-20 flex flex-col transform transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  lg:pt-0 pt-16`} // <-- add pt-16 for mobile view so content is below header
>
  <div className="p-6 border-b hidden lg:block">
    <h2 className="text-2xl font-extrabold" style={{ color: "#4a3a2f" }}>
      CafeChain
    </h2>
    <p className="text-sm text-gray-500 mt-1">{cafeInfo?.name}</p>
  </div>

  <nav className="mt-6 flex-1 flex flex-col gap-2 px-4">
    <Link
      to="/cafe"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Home
    </Link>
    <Link
      to="/cafe/dashboard/metrics"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Metrics
    </Link>
    <Link
      to="/cafe/dashboard/redemption"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Redemption
    </Link>
    <Link
      to="/cafe/dashboard/ads-events"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Ads & Events
    </Link>
    <Link
      to="/cafe/dashboard/activity"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Activity Log
    </Link>
    <Link
      to="/cafe/dashboard/offers"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Manage Offers
    </Link>
    <Link
      to="/cafe/dashboard/profile"
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
    >
      Profile & Settings
    </Link>
     <Link
    to="/cafe/dashboard/contactus"
    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
  >
    Contact Us
  </Link>
  </nav>

  <div className="p-4 border-t">
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
    >
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  </div>
</aside>


      {/* Dashboard Content */}
      <div className="flex-1  p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-md p-6 mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                Welcome back, {cafeInfo?.name}
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                {cafeInfo?.address && `${cafeInfo.address}`}
              </p>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Today's Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-indigo-600 text-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03]">
              <p className="text-xs uppercase opacity-80">Today Redemptions Amount</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{metrics?.daily?.redemptions}</p>
              <span className="mt-3 inline-block text-xs px-2 py-1 bg-white/20 rounded-full">Today</span>
            </div>

            <div className="group bg-emerald-600 text-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03] delay-100">
              <p className="text-xs uppercase opacity-80">Total Visits</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{metrics?.daily?.newCustomers}</p>
              <span className="mt-3 inline-block text-xs px-2 py-1 bg-white/20 rounded-full">All Time</span>
            </div>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Metrics Card */}
            <Link
              to="/cafe/dashboard/metrics"
              className="group bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-xl p-5 sm:p-6 flex flex-col items-start transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04]"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-white/20 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19V10M6 19V4M16 19v-7M21 19V8" />
                </svg>
              </div>
              <h3 className="font-bold">Metrics</h3>
              <p className="text-xs sm:text-sm opacity-80">View detailed sales & customers</p>
            </Link>

            {/* Redemption Card */}
            <Link
              to="/cafe/dashboard/redemption"
              className="group bg-emerald-600 text-white rounded-xl shadow-md hover:shadow-xl p-5 sm:p-6 flex flex-col items-start transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04] delay-100"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-white/20 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0H4" />
                </svg>
              </div>
              <h3 className="font-bold">Redemption</h3>
              <p className="text-xs sm:text-sm opacity-80">Process customer rewards</p>
            </Link>

            {/* Ads & Events Card */}
            <Link
              to="/cafe/dashboard/ads-events"
              className="group bg-orange-500 text-white rounded-xl shadow-md hover:shadow-xl p-5 sm:p-6 flex flex-col items-start transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04] delay-200"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-white/20 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l6-2v14l-6-2M5 8v8" />
                </svg>
              </div>
              <h3 className="font-bold">Ads & Events</h3>
              <p className="text-xs sm:text-sm opacity-80">Manage promotions & events</p>
            </Link>

            {/* Activity Card */}
            <Link
              to="/cafe/dashboard/activity"
              className="group bg-blue-600 text-white rounded-xl shadow-md hover:shadow-xl p-5 sm:p-6 flex flex-col items-start transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04] delay-300"
            >
              <div className="p-2 sm:p-3 rounded-lg bg-white/20 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0" />
                </svg>
              </div>
              <h3 className="font-bold">Activity Log</h3>
              <p className="text-xs sm:text-sm opacity-80">Recent transactions & logs</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
