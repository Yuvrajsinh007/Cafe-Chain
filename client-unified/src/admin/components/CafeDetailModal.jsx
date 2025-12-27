import React, { useState } from "react";
import { format } from 'date-fns';

export default function CafeDetailModal({ cafe, onClose, onApprove, onReject }) {
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{cafe.name}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                    <DetailItem label="Owner Name" value={cafe.ownerName} />
                    <DetailItem label="Owner Email" value={cafe.email} />
                    <DetailItem label="Owner Phone" value={cafe.ownerPhone} />
                    <DetailItem label="Cafe Phone" value={cafe.cafePhone} />
                    <DetailItem label="Address" value={cafe.address} fullWidth />
                    <DetailItem label="Description" value={cafe.description} fullWidth />
                    <DetailItem label="Opening Hours" value={cafe.openingHours} fullWidth />
                    <DetailItem label="Submission Date" value={format(new Date(cafe.createdAt), 'PPpp')} fullWidth />
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                        onClick={onApprove}
                    >
                        Approve
                    </button>
                    <button
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        onClick={() => setShowReject(true)}
                    >
                        Reject
                    </button>
                </div>

                {showReject && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <h3 className="font-semibold text-red-800 mb-2">Reason for Rejection (Optional)</h3>
                        <textarea
                            className="border border-gray-300 px-3 py-2 rounded-lg w-full mb-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
                            placeholder="e.g., Incomplete address, duplicate application..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            rows="3"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md"
                                onClick={() => setShowReject(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-1 rounded-md"
                                onClick={() => {
                                    onReject(reason);
                                    setShowReject(false);
                                }}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper component for consistent styling in the modal
const DetailItem = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? "md:col-span-2" : ""}>
        <p className="font-semibold text-gray-500 text-sm">{label}</p>
        <p>{value || "N/A"}</p>
    </div>
);