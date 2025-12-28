// client-unified/src/admin/pages/UserProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserProfileTabs from "../components/UserProfileTabs";
import Loader from "../components/Loader";
import { adminGetUserById } from "../api/api";
import { ArrowLeft } from "lucide-react";

export default function UserProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) return;
            try {
                const userData = await adminGetUserById(userId);
                setUser(userData);
            } catch (err) { toast.error("Could not load user data."); } 
            finally { setIsLoading(false); }
        };
        fetchUserProfile();
    }, [userId]);

    if (isLoading) return <Loader />;
    if (!user) return <div className="text-center p-8">User not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-amber-600 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Users
            </button>
            <UserProfileTabs user={user} />
        </div>
    );
}