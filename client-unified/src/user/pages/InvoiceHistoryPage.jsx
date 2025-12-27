// src/pages/InvoiceHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getInvoiceHistory } from "../api/api";
import Loader from "../components/Loader";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const InvoiceHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getInvoiceHistory();   // using apiClient wrapper
        setClaims(data || []);
      } catch (e) {
        console.error("History fetch error:", e);
        setError(e?.message || "Failed to load invoice history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen bg-white pt-20 md:pt-0 pb-20">
      {/* Back Button */}
      <motion.button
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-[#4a3a2f] hover:opacity-80 focus:outline-none focus:ring-0 border-none"
      > 
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </motion.button>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-extrabold mb-8 text-[#4a3a2f] text-center md:text-left"
      >
        Invoice History
      </motion.h1>

      {error && (
        <div className="mb-6 rounded-xl bg-red-100 text-red-700 p-4 font-semibold">
          {error}
        </div>
      )}

      {claims.length === 0 ? (
        <div className="text-center text-gray-500">
          No invoices yet. Upload your first invoice from{" "}
          <button
            onClick={() => navigate("/user/claim-reward")}
            className="underline font-semibold text-[#4a3a2f]"
          >
            Claim Rewards
          </button>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map((c, index) => (
            <motion.div
              key={c._id || index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="p-5 border rounded-2xl bg-white shadow-md hover:shadow-xl transition-all"
            >
              {/* Top row: Cafe + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-lg text-[#4a3a2f] truncate">
                    {c?.cafe?.name || "Cafe"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Uploaded on {formatDate(c?.createdAt)}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    statusStyles[c?.status] || "bg-stone-100 text-stone-700"
                  }`}
                  title={`Status: ${c?.status || "unknown"}`}
                >
                  {(c?.status || "pending").charAt(0).toUpperCase() +
                    (c?.status || "pending").slice(1)}
                </div>
              </div>

              {/* Middle: Amount */}
              <div className="mt-4 text-sm text-gray-600">
                Amount:{" "}
                <span className="font-semibold text-[#4a3a2f]">
                  ₹{Number(c?.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Bottom: actions */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs truncate">
                    {c?.invoiceUrl ? "Invoice attached" : "No invoice URL"}
                  </span>
                </div>
                {c?.invoiceUrl && (
                  <a
                    href={c.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a3a2f] px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Invoice
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistoryPage;
