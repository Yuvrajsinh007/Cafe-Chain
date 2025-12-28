// src/user/pages/ClaimRewardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Coffee,
  Hash,
  CheckCircle,
  AlertTriangle,
  Loader2,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRewardCafes, claimReward } from "../api/api";
import { toast } from "sonner"; // <-- added toast

const ClaimRewardPage = () => {
  const navigate = useNavigate();

  const [cafes, setCafes] = useState([]);
  const [cafeId, setCafeId] = useState("");
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const data = await getRewardCafes();
        setCafes(data || []);
      } catch (err) {
        console.error("Failed to fetch cafes:", err);
      }
    };
    fetchCafes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cafeId) {
      setSubmitMessage("Please select a cafe.");
      setIsSuccess(false);
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setSubmitMessage("Please enter a valid amount.");
      setIsSuccess(false);
      return;
    }
    if (!invoice) {
      setSubmitMessage("Please upload a valid invoice file.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append("cafeId", cafeId);
      formData.append("amount", amount);
      formData.append("invoice", invoice);

      const res = await claimReward(formData);

      setSubmitMessage(res?.message || "Claim submitted successfully!");
      setIsSuccess(true);

      // Show toast notification on success
      toast.success(res?.message || "Claim submitted successfully!");
    } catch (error) {
      console.error("Failed to submit claim:", error);
      const msg =
        error?.response?.data?.error ||
        "Oops! Something went wrong. Please try again.";
      setSubmitMessage(msg);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pithadf"];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;

    if (allowedTypes.includes(file.type) && allowedExtensions.test(file.name)) {
      setInvoice(file);
      setFileError("");
    } else {
      setInvoice(null);
      setFileError("Invalid file type. Please upload a JPG, PNG, or PDF.");
      e.target.value = null;
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const formContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#4A3A2F] font-sans pb-24 pt-20 md:pt-0">
      {/* Toast container */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#4A3A2F] transition-colors focus:outline-none focus:ring-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>


          <button
            onClick={() => navigate("/user/invoice-history")}
            className="flex items-center gap-2 text-[#4A3A2F] px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 transition"
            title="View your uploaded invoices"
          >
            <History className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">View History</span>
          </button>
        </motion.header>

        <main>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Claim Your Points
            </h1>
            <p className="text-base md:text-lg text-gray-500">
              Upload your cafe invoice to earn points for your visit.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 md:p-8 shadow-sm border border-stone-200">
            <form onSubmit={handleSubmit}>
              <motion.div
                className="space-y-6"
                variants={formContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={formItemVariants}>
                  <label
                    htmlFor="cafe"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Select Cafe
                  </label>
                  <div className="relative">
                    <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="cafe"
                      value={cafeId}
                      onChange={(e) => setCafeId(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] transition"
                    >
                      <option value="">Select a cafe</option>
                      {cafes.map((cafe) => (
                        <option key={cafe._id} value={cafe._id}>
                          {cafe.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Invoice Amount
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter total amount"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4A3A2F] transition"
                    />
                  </div>
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Invoice
                  </label>
                  <label
                    htmlFor="invoice-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl bg-white cursor-pointer transition-colors hover:border-[#4A3A2F] hover:bg-stone-100 ${fileError ? "border-red-500" : "border-stone-300"
                      }`}
                  >
                    {invoice ? (
                      <div className="flex items-center gap-3 text-[#4A3A2F] p-4 w-full">
                        <FileText className="w-8 h-8 flex-shrink-0" />
                        <div className="text-left min-w-0">
                          <span className="font-semibold block truncate">
                            {invoice.name}
                          </span>
                          <span className="block text-sm text-gray-500">
                            Click to change file
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <UploadCloud className="w-10 h-10 mx-auto mb-2" />
                        <span className="font-semibold text-gray-600">
                          Click to upload
                        </span>
                        <p className="text-xs">PNG & JPG only</p>
                      </div>
                    )}
                  </label>
                  <input
                    id="invoice-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  {fileError && (
                    <p className="text-sm text-red-600 mt-2">{fileError}</p>
                  )}
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full p-4 bg-[#4A3A2F] text-white font-bold rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Claim Points"}
                  </button>
                </motion.div>
              </motion.div>
            </form>

            <AnimatePresence>
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-6 p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-3 ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  {isSuccess ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>{submitMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClaimRewardPage;
