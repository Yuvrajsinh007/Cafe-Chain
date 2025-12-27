import React, { useState } from "react";
import { format } from 'date-fns';

// ✅ UPDATED: Now accepts a 'user' prop with the fetched data
export default function UserProfileTabs({ user }) {
    const [tab, setTab] = useState("profile");

    // Calculate total points from the points array
    const totalPoints = user.points?.reduce((acc, curr) => acc + curr.totalPoints, 0) || 0;

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-500">{user.email} | {user.phone}</p>
            </div>

            <div className="flex gap-4 mb-4 border-b">
                <TabButton name="Profile" currentTab={tab} setTab={() => setTab("profile")} />
                <TabButton name="Visit History" currentTab={tab} setTab={() => setTab("history")} />
                <TabButton name="Reward History" currentTab={tab} setTab={() => setTab("rewards")} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {/* --- Profile Tab --- */}
                {tab === "profile" && (
                    <div className="space-y-4">
                        <DetailItem label="Total Points" value={totalPoints} />
                        <DetailItem label="Referral Code" value={user.referralCode || "N/A"} />
                        <DetailItem label="Account Created" value={user.createdAt ? format(new Date(user.createdAt), 'PPpp') : 'N/A'} />
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2 text-gray-700">Admin Actions</h3>
                            <div className="flex gap-2">
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Suspend User</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Ban User</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* --- Visit History Tab --- */}
                {tab === "history" && <HistoryTable title="Visit History" items={user.visitLogs} />}
                
                {/* --- Reward History Tab --- */}
                {tab === "rewards" && <HistoryTable title="Reward History" items={user.rewardLogs} />}
            </div>
        </div>
    );
}

// Helper components for a cleaner UI
const TabButton = ({ name, currentTab, setTab }) => (
    <button
        className={`px-4 py-2 font-semibold border-b-2 transition ${currentTab === name.toLowerCase().split(' ')[0] ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        onClick={setTab}
    >
        {name}
    </button>
);

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg text-gray-800">{value}</p>
    </div>
);

const HistoryTable = ({ title, items }) => (
    <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        {items && items.length > 0 ? (
            <ul className="divide-y divide-gray-200">
                {items.map(item => (
                    <li key={item._id} className="py-3">
                        {/* Customize this based on your log schemas */}
                        <p className="font-medium">{item.description || `Event ID: ${item._id}`}</p>
                        <p className="text-sm text-gray-500">{item.createdAt ? format(new Date(item.createdAt), 'PPpp') : ''}</p>
                    </li>
                ))}
            </ul>
        ) : <p className="text-gray-500">No history found.</p>}
    </div>
);