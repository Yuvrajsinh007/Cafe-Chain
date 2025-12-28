import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { toast } from "sonner";
import { getOffers, addOffer, deleteOffer } from "../../api/api";
import { ArrowLeft, Plus, Trash2, Tag } from "lucide-react";

function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOffer, setNewOffer] = useState({ name: "", pointsRequired: "" });
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const response = await getOffers();
      setOffers(response.data);
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOffers();
  }, []);

  const handleAddOffer = async () => {
    if (!newOffer.name || !newOffer.pointsRequired) {
      toast.error("Please provide both an offer name and points.");
      return;
    }
    setLoading(true);
    try {
      const response = await addOffer(newOffer);
      setOffers([response.data.offer, ...offers]);
      toast.success("Offer added successfully!");
      setNewOffer({ name: "", pointsRequired: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    setLoading(true);
    try {
      await deleteOffer(offerId);
      setOffers(offers.filter((o) => o._id !== offerId));
      toast.success("Offer deleted successfully!");
    } catch (error) {
      console.error("Failed to delete offer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] mb-4 transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <h1 className="text-3xl font-black text-[#4A3A2F]">Manage Offers</h1>
                <p className="text-gray-500 mt-1">Create rewards for your loyal customers.</p>
            </div>
            
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A3A2F] text-white rounded-xl font-bold hover:bg-[#3b2d24] transition-all shadow-lg shadow-amber-900/10 hover:shadow-xl hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" /> Add New Offer
                </button>
            )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Offers List */}
            <div className="flex-1 w-full grid gap-4">
                <AnimatePresence mode="popLayout">
                    {offers.length > 0 ? (
                        offers.map((offer) => (
                            <motion.div
                                key={offer._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{offer.name}</h3>
                                        <p className="text-sm text-gray-500 font-medium">
                                            Requires <span className="text-amber-600 font-bold">{offer.pointsRequired} XP</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(offer._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Offer"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No offers active yet.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Form Side Panel */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full lg:w-96 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-6"
                    >
                        <h2 className="text-xl font-bold text-[#4A3A2F] mb-6">New Offer Details</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Offer Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Free Espresso"
                                    value={newOffer.name}
                                    onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Points Cost</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={newOffer.pointsRequired}
                                    onChange={(e) => setNewOffer({ ...newOffer, pointsRequired: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddOffer}
                                    className="flex-1 py-3 font-bold text-white bg-[#4A3A2F] hover:bg-[#3b2d24] rounded-xl transition-colors shadow-lg shadow-amber-900/10"
                                >
                                    Save Offer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default Offers;