import { Clock, Hourglass } from 'lucide-react';

function PendingApproval() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-[#4A3A2F]"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#4A3A2F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl shadow-amber-900/10 border border-gray-100 max-w-lg w-full relative z-10 text-center">
        
        {/* Animated Icon Container */}
        <div className="flex justify-center items-center w-24 h-24 mx-auto bg-amber-50 rounded-full mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-amber-400 opacity-20 animate-ping duration-1000"></div>
          <Clock className="w-10 h-10 text-amber-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#4A3A2F] mb-4 tracking-tight">
          Application Received
        </h1>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Thank you for submitting your cafe details. Our team is currently reviewing your application to ensure the highest quality for our network.
        </p>

        {/* Info Box */}
        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100 mb-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
                <Hourglass className="w-4 h-4" />
                <span>Estimated Review Time</span>
            </div>
            <p className="text-amber-700/80 text-sm">1 - 2 Business Days</p>
        </div>

        <p className="text-sm text-gray-400 font-medium">
          You will be notified via email once approved. <br/>
          You can close this window or click the logo to return home.
        </p>
      </div>
    </div>
  );
}

export default PendingApproval;