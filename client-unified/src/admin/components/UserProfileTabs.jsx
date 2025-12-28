import React, { useState } from "react";
import { format } from 'date-fns';
import { User, Calendar, Award, Shield, Ban } from "lucide-react";

export default function UserProfileTabs({ user }) {
    const [tab, setTab] = useState("profile");
    const totalPoints = user.points?.reduce((acc, curr) => acc + curr.totalPoints, 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-[#4A3A2F] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-amber-400 text-2xl font-bold">
                            {user.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-white/60 mt-1 flex items-center gap-2">
                                {user.phone} <span className="w-1 h-1 bg-white/40 rounded-full"></span> {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-amber-400 text-3xl font-bold">{totalPoints}</span>
                        <span className="text-xs text-white/50 uppercase tracking-widest">Total XP Points</span>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
                    <Award className="w-64 h-64" />
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                <TabButton name="Profile" icon={User} currentTab={tab} setTab={() => setTab("profile")} />
                <TabButton name="Visit History" icon={Calendar} currentTab={tab} setTab={() => setTab("history")} />
                <TabButton name="Reward History" icon={Award} currentTab={tab} setTab={() => setTab("rewards")} />
            </div>

            {/* Content Area */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                {tab === "profile" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <DetailBlock label="Referral Code" value={user.referralCode || "N/A"} />
                            <DetailBlock label="Joined On" value={user.createdAt ? format(new Date(user.createdAt), 'PPpp') : 'N/A'} />
                        </div>
                        
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" /> Admin Actions
                            </h3>
                            <div className="flex gap-4">
                                <button className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-medium transition border border-amber-200">
                                    Suspend Account
                                </button>
                                <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition border border-red-200 flex items-center gap-2">
                                    <Ban className="w-4 h-4" /> Ban User
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {tab === "history" && <HistoryTable title="Visit Logs" items={user.visitLogs} type="visit" />}
                {tab === "rewards" && <HistoryTable title="Reward Redemptions" items={user.rewardLogs} type="reward" />}
            </div>
        </div>
    );
}

const TabButton = ({ name, icon: Icon, currentTab, setTab }) => {
    const isActive = currentTab === name.toLowerCase().split(' ')[0];
    return (
        <button
            onClick={setTab}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                ? "bg-[#4A3A2F] text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <Icon className="w-4 h-4" />
            {name}
        </button>
    );
};

const DetailBlock = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
);

const HistoryTable = ({ title, items, type }) => (
    <div className="animate-in fade-in duration-300">
        <h2 className="text-lg font-bold mb-6 text-gray-800">{title}</h2>
        {items && items.length > 0 ? (
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-700">{item.description || (type === 'visit' ? 'Cafe Visit' : 'Reward Redeemed')}</span>
                                    <div className="text-xs text-gray-400 mt-0.5">ID: {item._id}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {item.createdAt ? format(new Date(item.createdAt), 'PPP p') : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No records found.</p>
            </div>
        )}
    </div>
);