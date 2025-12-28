import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CafeTable from "../components/CafeTable";
import Loader from "../components/Loader";
import { adminGetAllCafes } from "../api/api";
import { Search, Filter } from "lucide-react";

export default function CafeListPage() {
    const [cafes, setCafes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllCafes = async () => {
            try {
                const response = await adminGetAllCafes();
                setCafes(response);
            } catch (error) {
                toast.error("Failed to fetch cafe list.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllCafes();
    }, []);

    const handleRowClick = (cafe) => {
        navigate(`/pithad/cafes/${cafe._id}`);
    };

    const filteredCafes = cafes.filter(cafe => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (cafe.name?.toLowerCase().includes(searchLower) || 
                               cafe.address?.toLowerCase().includes(searchLower));
        const matchesStatus = statusFilter === "All" || cafe.status?.toLowerCase() === statusFilter.toLowerCase().replace(' ', '_');
        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Cafe Directory</h1>
                <p className="text-gray-500 text-sm">Manage registered cafes and their status</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" 
                        placeholder="Search by name or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white appearance-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All</option>
                        <option>Active</option>
                        <option>Pending Approval</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            <CafeTable cafes={filteredCafes} onRowClick={handleRowClick} />
        </div>
    );
}