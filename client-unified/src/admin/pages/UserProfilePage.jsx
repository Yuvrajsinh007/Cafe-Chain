// client-unified/src/admin/pages/UserProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserProfileTabs from "../components/UserProfileTabs";
import Loader from "../components/Loader";
import { adminGetUserById, adminDeleteUser } from "../api/api";
import { ArrowLeft, Mail, Phone, Calendar, Trash2, User } from "lucide-react";
import { format } from 'date-fns';

export default function UserProfilePage() {
    // FIX: Changed 'userId' to 'id' to match App.jsx route path="users/:id"
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use 'id' instead of 'userId'
        if (!id) return;
        
        const fetchUserProfile = async () => {
            try {
                const userData = await adminGetUserById(id);
                setUser(userData);
            } catch (err) { 
                toast.error("Could not load user data."); 
            } finally { 
                setIsLoading(false); 
            }
        };
        fetchUserProfile();
    }, [id]);

    const handleDeleteUser = async () => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await adminDeleteUser(id);
                toast.success("User deleted successfully");
                navigate('/pithad/users');
            } catch (error) {
                // Toast handled in api.js
            }
        }
    };

    if (isLoading) return <Loader />;
    if (!user) return <div className="text-center p-8">User not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-amber-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Users
            </button>

            {/* Header Card matching Cafe Premium Design */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 border-4 border-white shadow-lg">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone || 'N/A'}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleDeleteUser}
                        className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition font-medium text-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Delete User
                    </button>
                </div>
            </div>

            <UserProfileTabs user={user} />
        </div>
    );
}