import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../components/Loader";
import { format } from 'date-fns';
import { adminGetCafeById, adminUpdateCafeStatus, adminDeleteCafe } from "../api/api";
import { ArrowLeft, Building2, User, Phone, Mail, Calendar, Power, AlertTriangle, Trash2 } from "lucide-react";

export default function CafeDetailPage() {
    // FIX: Changed 'cafeId' to 'id' to match App.jsx route path="cafes/:id"
    const { id } = useParams();
    const navigate = useNavigate();
    const [cafe, setCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchCafeDetails = async () => {
            try {
                const data = await adminGetCafeById(id);
                setCafe(data);
            } catch (error) {
                toast.error("Failed to fetch cafe details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCafeDetails();
    }, [id]);

    const handleUpdateStatus = async (newStatus) => {
        try {
            const response = await adminUpdateCafeStatus(id, newStatus);
            toast.success(response.message || "Status updated successfully");
            setCafe(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleDeleteCafe = async () => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this cafe? This action cannot be undone.")) {
            try {
                await adminDeleteCafe(id);
                toast.success("Cafe deleted successfully");
                navigate('/pithad/cafes'); // Redirect to list
            } catch (error) {
                // Toast handled in api.js
            }
        }
    };

    if (isLoading) return <Loader />;
    if (!cafe) return <div className="text-center p-8">Cafe Not Found.</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-amber-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="h-32 bg-[#4A3A2F] relative">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                </div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-2">
                                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden">
                                    {cafe.image ? (
                                        <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                                    ) : (
                                        cafe.name.charAt(0)
                                    )}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold text-gray-800">{cafe.name}</h1>
                                <p className="text-gray-500 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> {cafe.address}
                                </p>
                            </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${
                            cafe.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                            {cafe.status ? cafe.status.replace('_', ' ') : 'Unknown'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Business Details</h3>
                            <div className="space-y-4">
                                <InfoRow icon={Phone} label="Business Phone" value={cafe.cafePhone} />
                                <InfoRow icon={Calendar} label="Joined On" value={cafe.createdAt ? format(new Date(cafe.createdAt), 'PPP') : 'N/A'} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Owner Information</h3>
                            <div className="space-y-4">
                                <InfoRow icon={User} label="Owner Name" value={cafe.ownerName} />
                                <InfoRow icon={Mail} label="Email" value={cafe.email} />
                                <InfoRow icon={Phone} label="Mobile" value={cafe.ownerPhone} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold text-gray-800 mb-4">Administrative Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {cafe.status !== 'active' && 
                        <button 
                            onClick={() => handleUpdateStatus('active')} 
                            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-medium shadow-sm shadow-green-200"
                        >
                            <Power className="w-4 h-4" /> Activate Cafe
                        </button>
                    }
                    {cafe.status !== 'rejected' && 
                        <button 
                            onClick={() => handleUpdateStatus('rejected')} 
                            className="flex items-center gap-2 bg-white text-orange-600 border border-orange-200 px-5 py-2.5 rounded-xl hover:bg-orange-50 transition font-medium"
                        >
                            <AlertTriangle className="w-4 h-4" /> Suspend Operations
                        </button>
                    }
                    <button 
                        onClick={handleDeleteCafe}
                        className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl hover:bg-red-100 transition font-medium ml-auto"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
}

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value || "N/A"}</p>
        </div>
    </div>
);