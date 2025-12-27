import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ NEW: Import Link and useNavigate
import axios from "axios";
import toast from "react-hot-toast";
import UserSearch from "../components/UserSearch";
import Loader from "../components/Loader";
import { adminGetAllUsers } from "../api/api";

export default function UserLookupPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await adminGetAllUsers();
                setAllUsers(response);
                setFilteredUsers(response);
            } catch (error) {
                toast.error("Failed to fetch user list.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = (query) => {
        if (!query) {
            setFilteredUsers(allUsers);
            return;
        }
        const results = allUsers.filter(user =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.phone?.includes(query)
        );
        setFilteredUsers(results);
    };

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">User Lookup</h1>
            <UserSearch onSearch={handleSearch} />

            <div className="mt-6 bg-white rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            // ✅ NEW: Make the entire list item a clickable link
                            <li key={user._id} className="hover:bg-gray-50 transition">
                                <Link to={`/pithad/users/${user._id}`} className="p-4 flex justify-between items-center block">
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.phone}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{user.email}</span>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 text-center text-gray-500">No users found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}