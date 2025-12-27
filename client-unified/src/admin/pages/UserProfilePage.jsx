import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserProfileTabs from "../components/UserProfileTabs";
import Loader from "../components/Loader";
import { adminGetUserById } from "../api/api";

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
            } catch (err) {
                toast.error("Could not load user data.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (isLoading) return <Loader />;
    if (!user) return <div className="text-center p-8">User not found.</div>;

    return (
        <div>
             <button onClick={() => navigate(-1)} className="mb-6 text-blue-500 hover:underline">
                &larr; Back to User List
            </button>
            <UserProfileTabs user={user} />
        </div>
    );
}