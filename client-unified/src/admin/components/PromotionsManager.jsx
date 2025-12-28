import React, { useState, useEffect } from "react";
import { createAnnouncement, adminDeleteAnnouncement, adminGetAnnouncements } from "../api/api";
import { Megaphone, Send, Trash2, AlertCircle, Sparkles } from "lucide-react";

export default function PromotionsManager() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch announcements on load
  const fetchAnnouncements = async () => {
    try {
      const data = await adminGetAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return;

    setLoading(true);
    try {
      await createAnnouncement({ title, body });
      setTitle("");
      setBody("");
      fetchAnnouncements(); // Refresh list after create
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      await adminDeleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Announcement Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <Megaphone className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">New Announcement</h2>
                    <p className="text-xs text-gray-500">Push to user homepage</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                        placeholder="e.g., Summer Sale"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition bg-gray-50 focus:bg-white min-h-[120px]"
                        placeholder="e.g., Get 50% off on your next visit..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#4A3A2F] text-white rounded-xl hover:bg-[#3b2d24] transition-all shadow-lg shadow-gray-900/10 disabled:opacity-70 font-semibold"
                >
                    {loading ? "Broadcasting..." : <><Send className="w-4 h-4" /> Broadcast Now</>}
                </button>
            </form>
        </div>
      </div>

      {/* Active Announcements List */}
      <div className="lg:col-span-2">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Live Announcements
                </h3>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                    {announcements.length} Active
                </span>
            </div>
            
            {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                <p>No active announcements.</p>
                <p className="text-sm opacity-60">Use the form to create one.</p>
            </div>
            ) : (
            <div className="grid gap-4">
                {announcements.map((item) => (
                <div 
                    key={item._id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                            <p className="text-gray-600 mt-1 leading-relaxed">{item.body}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-gray-400 font-medium">
                                    Posted on {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => handleDelete(item._id)}
                        className="mt-4 md:mt-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start md:self-center"
                        title="Delete Announcement"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );
}