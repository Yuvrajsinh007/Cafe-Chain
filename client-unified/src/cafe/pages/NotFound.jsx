import { Link } from 'react-router-dom';
import { Coffee, Home, AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#FDFBF7]">
      <div className="text-center max-w-lg w-full bg-white p-12 rounded-3xl shadow-xl shadow-amber-900/5 border border-gray-100 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-[#4A3A2F]"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#4A3A2F]/5 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 p-4 bg-amber-50 rounded-full text-amber-600 animate-pulse">
                <Coffee className="w-12 h-12" />
            </div>
            
            <h1 className="text-8xl font-black text-[#4A3A2F] leading-none mb-2">404</h1>
            
            <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Page Not Found
            </h2>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
                Oops! It looks like you've wandered off the menu. The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link 
                to="/cafe" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#4A3A2F] text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 hover:bg-[#3b2d24] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
                <Home className="w-5 h-5" />
                Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;