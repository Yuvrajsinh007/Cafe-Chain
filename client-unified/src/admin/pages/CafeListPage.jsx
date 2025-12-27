import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW: Import useNavigate
import axios from "axios";
import toast from "react-hot-toast";
import CafeTable from "../components/CafeTable";
import Loader from "../components/Loader";
import { adminGetAllCafes } from "../api/api";

export default function CafeListPage() {
    const [cafes, setCafes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate(); // ✅ NEW: Initialize navigate hook

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

    // This function will be called when a row is clicked
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
        <div>
            <h1 className="text-2xl font-bold mb-6">All Cafes</h1>
            <div className="mb-4 flex gap-4 bg-white p-4 rounded-lg shadow">
                <input 
                    className="border px-3 py-2 rounded-lg w-full" 
                    placeholder="Search by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="border px-3 py-2 rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option>All</option>
                    <option>Active</option>
                    <option>Pending Approval</option>
                    <option>Rejected</option>
                </select>
            </div>
            {/* ✅ UPDATED: Pass the new click handler to the table */}
            <CafeTable cafes={filteredCafes} onRowClick={handleRowClick} />
            {/* The modal is no longer needed on this page and has been removed */}
        </div>
    );
}