import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { format } from 'date-fns';
import { adminGetCafeById, adminUpdateCafeStatus } from "../api/api";

export default function CafeDetailPage() {
    const { cafeId } = useParams();
    const navigate = useNavigate();
    const [cafe, setCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!cafeId) {
            setIsLoading(false);
            return;
        }

        const fetchCafeDetails = async () => {
            try {
                const data = await adminGetCafeById(cafeId);
                setCafe(data);
            } catch (error) {
                toast.error("Failed to fetch cafe details.");
                console.error("API Request Failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCafeDetails();
    }, [cafeId]);

    const handleUpdateStatus = async (newStatus) => {
        try {
            const response = await adminUpdateCafeStatus(cafeId, newStatus);
            toast.success(response.message || "Status updated successfully");
            
            setCafe(prevCafe => ({ ...prevCafe, status: newStatus }));
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Update Status Error:", error);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!cafe) {
        return <div className="text-center p-8 text-xl font-semibold text-red-500">Cafe Not Found.</div>;
    }

    return (
        <div>
            <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">
                &larr; Back to Cafe List
            </button>
            <h1 className="text-3xl font-bold mb-2">{cafe.name}</h1>
            <p className="text-gray-500 mb-6">{cafe.address}</p>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-600">Cafe Details</h3>
                        <DetailItem label="Business Phone" value={cafe.cafePhone} />
                        <DetailItem label="Status" value={cafe.status} isStatus={true} />
                        <DetailItem label="Account Created" value={format(new Date(cafe.createdAt), 'PPpp')} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Owner Details</h3>
                        <DetailItem label="Owner Name" value={cafe.ownerName} />
                        <DetailItem label="Owner Email" value={cafe.email} />
                        <DetailItem label="Owner Phone" value={cafe.ownerPhone} />
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-600 mb-2">Admin Actions</h3>
                    <div className="flex flex-wrap gap-2">
                        {cafe.status !== 'active' && 
                            <button onClick={() => handleUpdateStatus('active')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Set Active</button>}
                        {cafe.status !== 'rejected' && 
                            <button onClick={() => handleUpdateStatus('rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Reject / Suspend</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

const DetailItem = ({ label, value, isStatus = false }) => (
    <div className="mt-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isStatus ? (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                value === 'active' ? 'bg-green-100 text-green-800' : 
                value === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                {value.replace('_', ' ')}
            </span>
        ) : (
            <p className="text-lg text-gray-800">{value || 'N/A'}</p>
        )}
    </div>
);