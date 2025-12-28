import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Loader from "../../components/Loader"; // ✅ Import Loader component
import cafeLogo from "../../assets/cc.png";
import axios from 'axios';

function FirstTimeSetup() {
  const [formData, setFormData] = useState({
    name: "",
    owner: "", // ✅ Added cafe owner name
    address: "",
    phone: "",
    email: "",
    description: "",
    openingHours: "",
    // You can add more fields here if needed, like features or gallery
    features: [],
    gallery: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Changed initial state to false
  const navigate = useNavigate();

  // This effect can be removed if you don't want an artificial initial load time
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Cafe name must be at least 3 characters.";
    }
    if (!formData.owner || formData.owner.length < 3) {
      newErrors.owner = "Owner name must be at least 3 characters.";
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.description.length > 500) { // Increased limit
      newErrors.description = "Description cannot exceed 500 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const onboardingToken = sessionStorage.getItem('onboardingToken');
      if (!onboardingToken) {
          toast.error("Your session has expired. Please start the registration process again.");
          navigate('/cafe/auth/register');
          return;
      }

      // Send the token in the authorization header for the backend to verify
      const response = await axios.put(
          '/api/cafe-owner/setup-profile', 
          formData,
          { headers: { 'Authorization': `Bearer ${onboardingToken}` } }
      );
    
      toast.success(response.data.message);
      sessionStorage.removeItem('onboardingToken'); // Clean up the temporary token
      navigate('/cafe/pending-approval'); // Navigate to the pending page
    } catch (error) {
        toast.error(error.response?.data?.error || 'Setup submission failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen flex bg-[#4a3a2f] text-white">
      {/* Left Side - Logo + Welcome */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#4a3a2f] p-8">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <img
              src={cafeLogo}
              alt="Cafe Logo"
              className="mx-auto rounded-full border-4 border-white shadow-lg w-48 h-48 object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold">Welcome to CafeChain</h2>
          <p className="mt-4 text-lg opacity-90">
            Let’s set up your café profile and start serving ☕
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white text-[#4a3a2f] flex items-center justify-center p-6 sm:p-10">
        <div className="max-w-lg w-full">
          <h1 className="text-3xl font-extrabold mb-6">Set Up Your Cafe Details</h1>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="name" className="block font-semibold">
                Cafe Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="owner" className="block font-semibold">
                Owner Name *
              </label>
              <input
                type="text"
                name="owner"
                id="owner"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.owner}
                onChange={handleChange}
              />
              {errors.owner && (
                <p className="text-red-600 text-sm mt-1">{errors.owner}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block font-semibold">
                Address *
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="phone" className="block font-semibold">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="email" className="block font-semibold">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block font-semibold">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers what makes your cafe special."
              ></textarea>
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="openingHours" className="block font-semibold">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                id="openingHours"
                placeholder="e.g. Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.openingHours}
                onChange={handleChange}
              />
              {errors.openingHours && (
                <p className="text-red-600 text-sm mt-1">{errors.openingHours}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4a3a2f] text-white font-semibold py-3 rounded-md hover:bg-[#3a2d24] transition disabled:opacity-60"
              >
                {isLoading ? "Submitting for Approval..." : "Submit for Approval"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FirstTimeSetup;