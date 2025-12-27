import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee } from 'lucide-react';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-warm-gray flex justify-center px-6 font-['Inter'] pt-20 md:pt-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .bg-warm-gray { background-color: #F8F6F1; }
        .bg-accent { background-color: #6D4C41; }
        .text-dark-brown { color: #4A3A2F; }
        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .bg-light-gray { background-color: #F8F8F8; }
      `}</style>

      {/* ---------- Desktop View ---------- */}
      <div className="hidden md:flex w-full max-w-xl bg-white rounded-2xl shadow-soft p-8 text-center self-center mt-24">
        <div className="w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white">
              <Coffee className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-6xl font-extrabold text-dark-brown">404</h1>
          <p className="mt-3 text-lg text-gray-600">Page not found</p>
          <p className="mt-1 text-sm text-gray-500">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-row justify-center gap-4">
            <Link
              to={isAuthenticated ? '/user/home' : '/user/login'}
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-colors"
            >
              {isAuthenticated ? 'Go to Home' : 'Go to Login'}
            </Link>
            <Link
              to="/user"
              className="px-6 py-3 rounded-xl bg-light-gray text-dark-brown font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Welcome
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Mobile View ---------- */}
      <div className="flex md:hidden w-full bg-white rounded-2xl shadow-soft p-6 text-center self-center mt-32">
        <div className="w-full">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-white">
              <Coffee className="w-7 h-7" />
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-dark-brown">404</h1>
          <p className="mt-2 text-base text-gray-600">Page not found</p>
          <p className="mt-1 text-xs text-gray-500 px-2">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to={isAuthenticated ? '/user/home' : '/user/login'}
              className="px-5 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-colors"
            >
              {isAuthenticated ? 'Go to Home' : 'Go to Login'}
            </Link>
            <Link
              to="/user"
              className="px-5 py-3 rounded-lg bg-light-gray text-dark-brown font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Welcome
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
