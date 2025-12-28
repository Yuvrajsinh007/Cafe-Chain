// client-unified/src/admin/pages/UserLookupPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import UserSearch from "../components/UserSearch";
import Loader from "../components/Loader";
import { adminGetAllUsers } from "../api/api";
import { ChevronRight } from "lucide-react";

export default function UserLookupPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await adminGetAllUsers();
                setAllUsers(response);
                setFilteredUsers(response);
            } catch (error) { toast.error("Failed to fetch user list."); } 
            finally { setIsLoading(false); }
        };
        fetchUsers();
    }, []);

    const handleSearch = (query) => {
        if (!query) { setFilteredUsers(allUsers); return; }
        const results = allUsers.filter(user =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.phone?.includes(query)
        );
        setFilteredUsers(results);
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <p className="text-gray-500 text-sm">Search and manage registered users</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-6">
                    <UserSearch onSearch={handleSearch} />
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <li key={user._id} className="hover:bg-gray-50 transition-colors group">
                                    <Link to={`/pithad/users/${user._id}`} className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 group-hover:text-amber-600 transition-colors">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.phone} • {user.email}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500" />
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="p-8 text-center text-gray-400">No users match your search.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}