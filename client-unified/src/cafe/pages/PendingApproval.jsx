import { Clock } from 'lucide-react';

function PendingApproval() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full">
        <div className="flex justify-center items-center w-20 h-20 mx-auto bg-yellow-100 rounded-full mb-6">
          <Clock className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#4a3a2f] mb-3">
          Application Submitted
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Thank you for submitting your cafe details. Our team will review your application, and you will be notified via email once it's approved. This usually takes 1-2 business days.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          You can now close this window. or click on cafechain logo to go back to home page.
        </p>
      </div>
    </div>
  );
}

export default PendingApproval;