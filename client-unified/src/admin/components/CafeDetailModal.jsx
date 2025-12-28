import React, { useState } from "react";
import { format } from 'date-fns';
import { X, Phone, Mail, MapPin, Clock, Info } from "lucide-react";

export default function CafeDetailModal({ cafe, onClose, onApprove, onReject }) {
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4A3A2F]">{cafe.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">Application Details</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Owner Info</h3>
                            <DetailRow icon={Info} label="Name" value={cafe.ownerName} />
                            <DetailRow icon={Mail} label="Email" value={cafe.email} />
                            <DetailRow icon={Phone} label="Phone" value={cafe.ownerPhone} />
                        </div>
                        
                        <div className="space-y-6">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Business Info</h3>
                             <DetailRow icon={Phone} label="Cafe Phone" value={cafe.cafePhone} />
                             <DetailRow icon={Clock} label="Submitted" value={cafe.createdAt ? format(new Date(cafe.createdAt), 'PPP p') : 'N/A'} />
                             <DetailRow icon={Clock} label="Hours" value={cafe.openingHours} />
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <DetailRow icon={MapPin} label="Address" value={cafe.address} fullWidth />
                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                <span className="text-xs font-bold text-amber-600 uppercase mb-1 block">Description</span>
                                <p className="text-gray-700 leading-relaxed">{cafe.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Form */}
                    {showReject && (
                        <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold text-red-800 mb-2">Rejection Reason</h3>
                            <textarea
                                className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-400 outline-none bg-white text-gray-700 placeholder-red-300"
                                placeholder="Please explain why the application is being rejected..."
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows="3"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                                    onClick={() => setShowReject(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm shadow-red-200"
                                    onClick={() => { onReject(reason); setShowReject(false); }}
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {!showReject && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
                        <button
                            className="px-6 py-2.5 rounded-xl font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                            onClick={() => setShowReject(true)}
                        >
                            Reject Application
                        </button>
                        <button
                            className="px-8 py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all transform active:scale-95"
                            onClick={onApprove}
                        >
                            Approve Cafe
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const DetailRow = ({ icon: Icon, label, value, fullWidth }) => (
    <div className={`flex items-start gap-4 ${fullWidth ? "w-full" : ""}`}>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-gray-800 font-medium mt-0.5">{value || "N/A"}</p>
        </div>
    </div>
);