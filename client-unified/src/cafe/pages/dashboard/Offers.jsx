import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

// ✅ 1. IMPORT the new API functions
import { getOffers, addOffer, deleteOffer } from "../../api/api";

function Offers() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  // ✅ 2. UPDATE state to match the backend model ('pointsRequired')
  const [newOffer, setNewOffer] = useState({ name: "", pointsRequired: "" });
  const [loading, setLoading] = useState(true);

  // ✅ 3. CREATE a function to fetch data from the backend
  const fetchOffers = async () => {
    try {
      const response = await getOffers();
      setOffers(response.data); // The backend returns an array of offers
    } catch (error) {
      // Error toast is already handled by the apiClient interceptor
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. CALL the fetch function on component mount
  useEffect(() => {
    setLoading(true);
    fetchOffers();
  }, []);

  // ✅ 5. REWRITE handleAddOffer to call the backend
  const handleAddOffer = async () => {
    if (!newOffer.name || !newOffer.pointsRequired) {
      toast.error("Please provide both an offer name and points.");
      return;
    }

    setLoading(true);
    try {
      const response = await addOffer(newOffer);
      // Add the newly created offer to the top of the list
      setOffers([response.data.offer, ...offers]);
      toast.success("Offer added successfully!");

      // Reset form
      setNewOffer({ name: "", pointsRequired: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add offer:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 6. REWRITE handleDelete to call the backend
  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteOffer(offerId);
      // Filter out the deleted offer from the state
      setOffers(offers.filter((o) => o._id !== offerId));
      toast.success("Offer deleted successfully!");
    } catch (error) {
      console.error("Failed to delete offer:", error);
    } finally {
      setLoading(false);
    }
  };

  // The `handleEdit` logic was removed as there's no active backend endpoint for it.

  if (loading) return <Loader />;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row gap-6">
      {/* Left Section - Offers List */}
      <motion.div
        className="flex-1 bg-white shadow-lg rounded-2xl p-6"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h1
            className="text-2xl sm:text-3xl font-extrabold"
            style={{ color: "#4a3a2f" }}
          >
            Café Offers
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{ backgroundColor: "#4a3a2f" }}
          >
            Back
          </button>
        </div>

        <div className="grid gap-4">
          {offers.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              No offers available. Add one to get started!
            </p>
          ) : (
            <AnimatePresence>
              {offers.map((offer) => (
                <motion.div
                  // ✅ 7. USE `_id` from MongoDB as the key
                  key={offer._id}
                  className="flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div>
                    <p className="font-bold text-gray-800">{offer.name}</p>
                    <p className="text-sm text-gray-600">
                      Points Required:{" "}
                      {/* ✅ 8. USE `pointsRequired` to display */}
                      <span className="font-semibold">{offer.pointsRequired}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      // ✅ 9. PASS the correct `_id` to the handler
                      onClick={() => handleDelete(offer._id)}
                      className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Right Section - Add Offer */}
      <motion.div
        className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-6 h-fit"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition"
            style={{ backgroundColor: "#4a3a2f" }}
          >
            + Add Offer
          </button>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-bold" style={{ color: "#4a3a2f" }}>
              Add New Offer
            </h2>
            <input
              type="text"
              placeholder="Offer Name"
              value={newOffer.name}
              onChange={(e) =>
                setNewOffer({ ...newOffer, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4a3a2f]"
            />
            <input
              type="number"
              placeholder="Points Required"
              // ✅ 10. BIND value and onChange to `pointsRequired`
              value={newOffer.pointsRequired}
              onChange={(e) =>
                setNewOffer({ ...newOffer, pointsRequired: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4a3a2f]"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddOffer}
                className="flex-1 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
                style={{ backgroundColor: "#4a3a2f" }}
              >
                Done
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}

export default Offers;