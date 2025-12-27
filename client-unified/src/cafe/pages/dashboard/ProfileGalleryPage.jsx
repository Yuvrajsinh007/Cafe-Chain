import React, { useState, useEffect } from "react";
import { useAppContext } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  getCafeProfile,
  updateCafeProfile,
  addCafeImage,
  deleteCafeImage,
} from "../../api/api";
import {
  BuildingStorefrontIcon,
  PhotoIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function ProfileGalleryPage() {
  const { state, dispatch } = useAppContext();
  const { cafeInfo } = state || {};
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  
  // Initialize form state
  const [cafeForm, setCafeForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    openingHours: "",
    tags: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 1. Fetch Profile Data
  useEffect(() => {
    const fetchCafeProfile = async () => {
      try {
        const response = await getCafeProfile();
        dispatch({ type: "SET_CAFE_INFO", payload: response.data.cafe });
      } catch (error) {
        toast.error("Failed to fetch cafe profile.");
      }
    };

    if (!cafeInfo) {
      fetchCafeProfile();
    }
  }, [cafeInfo, dispatch]);

  // 2. Sync Form with cafeInfo when it becomes available
  useEffect(() => {
    if (cafeInfo) {
      setCafeForm({
        name: cafeInfo.name || "",
        address: cafeInfo.address || "",
        phone: cafeInfo.cafePhone || "",
        email: cafeInfo.email || "",
        description: cafeInfo.description || "",
        openingHours: cafeInfo.openingHours || "",
        tags: cafeInfo.features || [],
      });
    }
  }, [cafeInfo]);

  if (!cafeInfo) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const availableTags = [
    "Coffee",
    "Tea",
    "Italian Food",
    "Fast Food",
    "Pastries",
    "Breakfast",
    "Lunch",
    "Vegan",
    "Organic",
    "Specialty Coffee",
    "Wifi",
    "Study Friendly",
    "Pet Friendly",
    "Outdoor Seating",
    "Live Music",
    "Fastfood"
  ];

  const handleCafeFormChange = (e) => {
    const { name, value } = e.target;
    setCafeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setCafeForm((prev) => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter((t) => t !== tag) };
      } else if (currentTags.length < 3) {
        return { ...prev, tags: [...currentTags, tag] };
      }
      return prev;
    });
  };

  const handleImageSelect = (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if ((cafeInfo.images?.length || 0) + selectedImages.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images in total.");
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    setUploadProgress(20);
    for (const image of selectedImages) {
      try {
        const base64Image = await toBase64(image);
        const response = await addCafeImage(base64Image);
        dispatch({
          type: "SET_CAFE_INFO",
          payload: { ...cafeInfo, images: response.data.images },
        });
      } catch (error) {
        toast.error(`Failed to upload ${image.name}.`);
      }
    }
    setUploadProgress(100);

    setSelectedImages([]);
    setImagePreviews([]);
    toast.success("Images uploaded successfully!");
    setTimeout(() => setUploadProgress(0), 1000);
  };

  const handleRemoveImage = async (public_id) => {
    try {
      const response = await deleteCafeImage(public_id);
      dispatch({
        type: "SET_CAFE_INFO",
        payload: { ...cafeInfo, images: response.data.images },
      });
      toast.success("Image removed!");
    } catch (error) {
      toast.error("Failed to remove image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...cafeForm, features: cafeForm.tags };
      delete payload.tags;
      // We don't send name, phone, email back since they are read-only/fixed
      const response = await updateCafeProfile(payload);
      dispatch({ type: "SET_CAFE_INFO", payload: response.data.cafe });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const tabConfig = [
    { id: "profile", label: "Cafe Profile", icon: BuildingStorefrontIcon },
    { id: "gallery", label: "Photo Gallery", icon: PhotoIcon },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="hidden md:flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition font-medium 
                       border-none outline-none focus:outline-none focus:ring-0 bg-transparent"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold font-serif text-gray-800 mb-3 tracking-tight">
            Manage Your Cafe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Keep your cafe details up-to-date and showcase your atmosphere with photos.
          </p>
        </header>

        {/* Tabs */}
        <nav className="flex justify-center mb-10">
          <div className="flex bg-gray-100 rounded-xl overflow-hidden shadow-sm">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-400 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
              <div>
                <h2 className="text-2xl font-bold font-serif text-gray-800">Cafe Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your cafe details to help customers find you.
                </p>
              </div>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-5 py-2 border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Editable Form */}
              {editMode ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* --- READ ONLY FIELDS --- */}
                  
                  {/* Name (Read Only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Cafe Name</label>
                    <input
                      type="text"
                      name="name"
                      value={cafeForm.name}
                      readOnly
                      title="Cafe name cannot be changed"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Phone (Read Only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={cafeForm.phone}
                      readOnly
                      title="Phone number cannot be changed"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Email (Read Only) */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={cafeForm.email}
                      readOnly
                      title="Email address cannot be changed"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* --- EDITABLE FIELDS --- */}

                  {/* Address */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={cafeForm.address}
                      onChange={handleCafeFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Hours */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Opening Hours</label>
                    <input
                      type="text"
                      name="openingHours"
                      value={cafeForm.openingHours}
                      onChange={handleCafeFormChange}
                      placeholder="e.g. Mon-Fri: 8am-6pm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={cafeForm.description}
                      onChange={handleCafeFormChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Tags */}
                  <div className="lg:col-span-2 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Cafe Tags (Select up to 3)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-4 py-2 rounded-full text-sm border transition ${
                            cafeForm.tags.includes(tag)
                              ? "bg-gradient-to-r from-amber-500 to-orange-400 text-white border-amber-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-lg hover:opacity-90 transition shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact */}
                  <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <PhoneIcon className="h-5 w-5" /> Contact
                    </h3>
                    <p className="text-sm text-gray-600"><strong>Phone:</strong> {cafeInfo.cafePhone || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {cafeInfo.email || "N/A"}</p>
                  </div>

                  {/* Location */}
                  <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <MapPinIcon className="h-5 w-5" /> Location & Hours
                    </h3>
                    <p className="text-sm text-gray-600"><strong>Address:</strong> {cafeInfo.address || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Hours:</strong> {cafeInfo.openingHours || "Not specified"}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <InformationCircleIcon className="h-5 w-5" /> About
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {cafeInfo.description || "No description yet."}
                    </p>
                  </div>

                  {/* Tags */}
                  {cafeInfo.features && cafeInfo.features.length > 0 && (
                    <div className="md:col-span-2 p-6 bg-white rounded-xl border border-gray-200">
                      <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                        Cafe Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cafeInfo.features.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-amber-500 to-orange-400 text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <section className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <h2 className="text-2xl font-bold font-serif text-gray-800">Photo Gallery</h2>
              <p className="text-sm text-gray-600">Upload and manage cafe photos.</p>
            </div>

            <div className="p-8">
              {/* Upload */}
              <div className="mb-10 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="text-center">
                  <PhotoIcon className="h-12 w-12 mx-auto text-amber-500" />
                  <p className="mt-3 text-sm text-gray-600">
                    Select and upload new cafe photos
                  </p>
                  <label className="inline-block mt-4 cursor-pointer">
                    <span className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-lg hover:opacity-90 transition">
                      Choose Images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="sr-only"
                    />
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
                            setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      onClick={handleImageUpload}
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-lg hover:opacity-90 transition"
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImages([]);
                        setImagePreviews([]);
                        setUploadProgress(0);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cafeInfo.images && cafeInfo.images.length > 0 ? (
                  cafeInfo.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group"
                    >
                      <img src={img.url} alt="Cafe" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(img.public_id)}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-sm text-gray-600">
                    No photos uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfileGalleryPage;