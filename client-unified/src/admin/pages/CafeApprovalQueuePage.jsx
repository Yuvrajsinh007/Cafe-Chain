import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CafeTable from "../components/CafeTable";
import CafeDetailModal from "../components/CafeDetailModal";
import Loader from "../components/Loader";
import { adminGetPendingCafes, adminApproveCafe, adminRejectCafe } from "../api/api";

export default function CafeApprovalQueuePage() {
    const [pendingCafes, setPendingCafes] = useState([]);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch pending cafes from the backend
    const fetchPendingCafes = async () => {
        setIsLoading(true);
        try {
            const cafes = await adminGetPendingCafes();
            setPendingCafes(cafes);
        } catch (error) {
            toast.error("Failed to fetch pending cafes.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchPendingCafes();
    }, []);

    // Handler for approving a cafe
    const handleApprove = async (cafeId) => {
        try {
            const response = await adminApproveCafe(cafeId);
            toast.success(response.message);
            setPendingCafes(currentCafes => currentCafes.filter(cafe => cafe._id !== cafeId));
            setSelectedCafe(null);
        } catch (error) {
            toast.error("Failed to approve cafe.");
            console.error(error);
        }
    };

    // Handler for rejecting a cafe
    const handleReject = async (cafeId, reason) => {
        try {
            const response = await adminRejectCafe(cafeId, reason);
            toast.success(response.message);
            setPendingCafes(currentCafes => currentCafes.filter(cafe => cafe._id !== cafeId));
            setSelectedCafe(null);
        } catch (error) {
            toast.error("Failed to reject cafe.");
            console.error(error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Cafe Approval Queue</h1>
            {pendingCafes.length > 0 ? (
                <CafeTable
                    cafes={pendingCafes}
                    onRowClick={setSelectedCafe}
                    approvalMode
                />
            ) : (
                <p className="text-gray-500">There are no pending cafe approvals.</p>
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