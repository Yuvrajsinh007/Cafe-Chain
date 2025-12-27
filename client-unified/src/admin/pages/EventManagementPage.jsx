// src/admin/pages/EventManagementPage.jsx

import React, { useState, useEffect } from "react";
import { adminCreateEvent, adminGetCafesList } from "../api/api"; // Import your API functions

function EventManagementPage() {
  const [cafes, setCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    cafe: "",
  });

  // Fetch the list of cafes when the component loads
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const cafeData = await adminGetCafesList();
        setCafes(cafeData);
      } catch (error) {
        console.error("Failed to load cafes for dropdown", error);
      }
    };
    fetchCafes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image for the event.");
      return;
    }
    
    setIsLoading(true);

    // Create a FormData object to send file and text data together
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("cafe", formData.cafe);
    data.append("image", imageFile);

    try {
      await adminCreateEvent(data);
      // Reset form on success
      setFormData({ name: "", description: "", date: "", time: "", cafe: "" });
      setImageFile(null);
      e.target.reset();
    } catch (error) {
      console.error("Event creation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-2xl"
      >
        <h2 className="text-xl font-semibold mb-6 border-b pb-4">Create New Event</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Cafe</label>
            <select
              name="cafe"
              value={formData.cafe}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>-- Choose a cafe --</option>
              {cafes.map((cafe) => (
                <option key={cafe._id} value={cafe._id}>{cafe.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                // ADDED: Prevent selecting past dates
                min={new Date().toISOString().split("T")[0]}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Event Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default EventManagementPage;