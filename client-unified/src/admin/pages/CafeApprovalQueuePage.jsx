import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import CafeTable from "../components/CafeTable";
import CafeDetailModal from "../components/CafeDetailModal";
import Loader from "../components/Loader";
import { adminGetPendingCafes, adminApproveCafe, adminRejectCafe } from "../api/api";
import { Inbox } from "lucide-react";

export default function CafeApprovalQueuePage() {
    const [pendingCafes, setPendingCafes] = useState([]);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingCafes = async () => {
        setIsLoading(true);
        try {
            const cafes = await adminGetPendingCafes();
            setPendingCafes(cafes);
        } catch (error) {
            toast.error("Failed to fetch pending cafes.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingCafes();
    }, []);

    const handleApprove = async (cafeId) => {
        try {
            const response = await adminApproveCafe(cafeId);
            toast.success(response.message);
            setPendingCafes(current => current.filter(cafe => cafe._id !== cafeId));
            setSelectedCafe(null);
        } catch (error) {
            toast.error("Failed to approve cafe.");
        }
    };

    const handleReject = async (cafeId, reason) => {
        try {
            const response = await adminRejectCafe(cafeId, reason);
            toast.success(response.message);
            setPendingCafes(current => current.filter(cafe => cafe._id !== cafeId));
            setSelectedCafe(null);
        } catch (error) {
            toast.error("Failed to reject cafe.");
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Approval Queue</h1>
                    <p className="text-gray-500 text-sm">Review incoming cafe partner applications</p>
                </div>
                <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-bold text-sm">
                    {pendingCafes.length} Pending
                </div>
            </div>

            {pendingCafes.length > 0 ? (
                <CafeTable
                    cafes={pendingCafes}
                    onRowClick={setSelectedCafe}
                    approvalMode
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                    <Inbox className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm">No pending applications at the moment.</p>
                </div>
            )}

            {selectedCafe && (
                <CafeDetailModal
                    cafe={selectedCafe}
                    onClose={() => setSelectedCafe(null)}
                    onApprove={() => handleApprove(selectedCafe._id)}
                    onReject={(reason) => handleReject(selectedCafe._id, reason)}
                />
            )}
        </div>
    );
}