import React, { useState, useEffect } from "react";
import { adminCreateEvent, adminGetCafesList } from "../api/api";
import { CalendarPlus, Upload, Clock, MapPin } from "lucide-react";

function EventManagementPage() {
  const [cafes, setCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", date: "", time: "", cafe: "" });

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const cafeData = await adminGetCafesList();
        setCafes(cafeData);
      } catch (error) {
        console.error("Failed to load cafes", error);
      }
    };
    fetchCafes();
  }, []);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image.");
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append("image", imageFile);

    try {
      await adminCreateEvent(data);
      setFormData({ name: "", description: "", date: "", time: "", cafe: "" });
      setImageFile(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-gray-800">Event Manager</h1>
         <p className="text-gray-500 text-sm">Create and schedule new events for cafes</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <CalendarPlus className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">New Event Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Name</label>
                 <input
                    type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="e.g., Live Music Night" required
                 />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Host Cafe</label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <select
                        name="cafe" value={formData.cafe} onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white appearance-none cursor-pointer"
                        required
                    >
                        <option value="" disabled>Select a Location</option>
                        {cafes.map(cafe => <option key={cafe._id} value={cafe._id}>{cafe.name}</option>)}
                    </select>
                 </div>
              </div>

              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                 <textarea
                    name="description" value={formData.description} onChange={handleInputChange} rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="Event details..." required
                 ></textarea>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                 <input
                    type="date" name="date" value={formData.date} onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    required
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time</label>
                 <div className="relative">
                    <Clock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                        type="time" name="time" value={formData.time} onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        required
                    />
                 </div>
              </div>

              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image</label>
                 <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                    <input 
                        type="file" name="image" onChange={handleFileChange} required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">{imageFile ? imageFile.name : "Click to upload event image"}</span>
                 </div>
              </div>
           </div>

           <div className="pt-4">
               <button
                  type="submit" disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-70"
               >
                  {isLoading ? "Publishing Event..." : "Publish Event"}
               </button>
           </div>
        </form>
      </div>
    </div>
  );
}

export default EventManagementPage;