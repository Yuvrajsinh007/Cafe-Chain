import React, { useState, useEffect } from "react";
import { useAppContext } from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // ✅ Correct import for toast function
import {
  getCafeProfile,
  updateCafeProfile,
  addCafeImage,
  deleteCafeImage,
} from "../../api/api";
import {
  Store,
  Image,
  Phone,
  MapPin,
  ArrowLeft,
  Info,
  X,
  Camera,
  Trash2,
  Mail,
  Clock,
  Tag
} from "lucide-react";

function ProfileGalleryPage() {
  const { state, dispatch } = useAppContext();
  const { cafeInfo } = state || {};
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  
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

  // 2. Sync Form with cafeInfo
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
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Loading Profile...</div>;
  }

  const availableTags = [
    "Coffee", "Tea", "Italian Food", "Fast Food", "Pastries", "Breakfast", "Lunch", "Vegan", "Organic", "Specialty Coffee", "Wifi", "Study Friendly", "Pet Friendly", "Outdoor Seating", "Live Music", "Fastfood"
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
      const response = await updateCafeProfile(payload);
      dispatch({ type: "SET_CAFE_INFO", payload: response.data.cafe });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800 p-6 lg:p-12">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Back button */}
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] transition-colors font-medium mb-8"
        >
            <ArrowLeft className="h-5 w-5" /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-black text-[#4A3A2F] tracking-tight">Manage Cafe</h1>
                <p className="text-lg text-gray-500 mt-2">Update your details and gallery.</p>
            </div>

            {/* Tabs */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'profile' 
                        ? 'bg-[#4A3A2F] text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <Store className="w-4 h-4" /> Profile
                </button>
                <button 
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'gallery' 
                        ? 'bg-[#4A3A2F] text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <Image className="w-4 h-4" /> Gallery
                </button>
            </div>
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 lg:p-12">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
                    {!editMode && (
                        <button 
                            onClick={() => setEditMode(true)} 
                            className="px-5 py-2 border border-[#4A3A2F] text-[#4A3A2F] font-bold rounded-xl hover:bg-[#4A3A2F] hover:text-white transition-all"
                        >
                            Edit Details
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Read Only Block */}
                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Fixed Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Cafe Name</label>
                                    <p className="font-bold text-gray-800 text-lg">{cafeForm.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Registered Email</label>
                                    <p className="font-medium text-gray-700 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> {cafeForm.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Registered Phone</label>
                                    <p className="font-medium text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> {cafeForm.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editable Block */}
                    <div className="space-y-6">
                        {/* Address */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Address</label>
                            {editMode ? (
                                <input 
                                    name="address" 
                                    value={cafeForm.address} 
                                    onChange={handleCafeFormChange} 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" 
                                />
                            ) : (
                                <p className="text-gray-600 flex items-start gap-2"><MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"/> {cafeForm.address}</p>
                            )}
                        </div>

                        {/* Hours */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block">Opening Hours</label>
                            {editMode ? (
                                <input 
                                    name="openingHours" 
                                    value={cafeForm.openingHours} 
                                    onChange={handleCafeFormChange} 
                                    placeholder="e.g. Mon-Fri: 8am-6pm"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" 
                                />
                            ) : (
                                <p className="text-gray-600 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-400"/> {cafeForm.openingHours || "Not Set"}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 block">About</label>
                            {editMode ? (
                                <textarea 
                                    name="description" 
                                    value={cafeForm.description} 
                                    onChange={handleCafeFormChange} 
                                    rows={4} 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none" 
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-sm">{cafeForm.description || "No description provided."}</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-400" /> Tags {editMode && <span className="text-gray-400 font-normal text-xs">(Max 3)</span>}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {editMode ? (
                                    availableTags.map(tag => (
                                        <button 
                                            key={tag} 
                                            type="button" 
                                            onClick={() => handleTagToggle(tag)} 
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                cafeForm.tags.includes(tag) 
                                                ? "bg-[#4A3A2F] text-white border-[#4A3A2F] shadow-sm" 
                                                : "bg-white text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))
                                ) : (
                                    cafeForm.tags.length > 0 ? (
                                        cafeForm.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">No tags selected.</span>
                                    )
                                )}
                            </div>
                        </div>

                        {editMode && (
                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setEditMode(false)} 
                                    className="flex-1 px-6 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-[2] px-6 py-3 font-bold text-white bg-[#4A3A2F] rounded-xl hover:bg-[#3b2d24] transition-colors shadow-lg shadow-amber-900/10"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 lg:p-12">
                <div className="mb-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 hover:border-amber-400 hover:bg-amber-50/10 transition-all duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-amber-500">
                        <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Photos</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Showcase your ambiance. Max 5 photos allowed.</p>
                    
                    <label className="cursor-pointer inline-flex items-center gap-2 px-8 py-3 bg-[#4A3A2F] text-white font-bold rounded-xl hover:bg-[#3b2d24] transition-all shadow-lg shadow-amber-900/10 transform active:scale-95">
                        <span>Select Images</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>

                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                                    <button 
                                        onClick={() => { setSelectedImages(p => p.filter((_, idx) => idx !== i)); setImagePreviews(p => p.filter((_, idx) => idx !== i)); }} 
                                        className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {imagePreviews.length > 0 && (
                        <div className="mt-8 flex justify-center gap-4 border-t border-gray-200 pt-6">
                            <button 
                                onClick={() => { setImagePreviews([]); setSelectedImages([]); setUploadProgress(0); }} 
                                className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-200 rounded-lg transition"
                            >
                                Clear
                            </button>
                            <button 
                                onClick={handleImageUpload} 
                                className="px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-sm"
                            >
                                Confirm Upload
                            </button>
                        </div>
                    )}
                    
                    {uploadProgress > 0 && (
                        <div className="mt-6 w-full max-w-md mx-auto bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <Image className="w-5 h-5 text-amber-600"/>
                    <h3 className="font-bold text-gray-800 text-lg">Current Gallery</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cafeInfo.images?.length > 0 ? (
                        cafeInfo.images.map((img) => (
                            <div key={img.public_id} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                                <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cafe" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <button 
                                        onClick={() => handleRemoveImage(img.public_id)} 
                                        className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-all shadow-xl transform hover:scale-110"
                                        title="Delete Image"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">Gallery is empty.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileGalleryPage;