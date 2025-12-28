import React from "react";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-lg text-gray-600">Page not found</p>
        <p className="text-sm text-gray-400 mt-2">The requested resource could not be located on this server.</p>
    </div>
  );
}