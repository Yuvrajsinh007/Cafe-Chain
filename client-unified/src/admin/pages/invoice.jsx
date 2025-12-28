import React, { useEffect, useState } from "react";
import { Eye, Check, X, CreditCard } from "lucide-react";
import { adminGetPendingClaims, adminApproveClaim, adminRejectClaim } from "../api/api";

export default function AdminInvoicePage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchClaims() {
    setLoading(true);
    try {
      const data = await adminGetPendingClaims();
      setClaims(data);
    } catch {
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClaims();
  }, []);

  async function handleApprove(id) {
    await adminApproveClaim(id);
    fetchClaims();
  }

  async function handleReject(id) {
    await adminRejectClaim(id);
    fetchClaims();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reward Claims</h1>
        <p className="text-gray-500 text-sm">Verify and process user reward redemptions</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <CreditCard className="w-12 h-12 mb-3 opacity-20" />
             <p>No pending claims needing verification.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Cafe</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Proof</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {claims.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{c.user?.name}</div>
                        <div className="text-xs text-gray-500">{c.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.cafe?.name}</td>
                    <td className="px-6 py-4">
                        <span className="font-mono font-bold text-amber-600">₹{c.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                        {c.invoiceUrl ? (
                            <a href={c.invoiceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                                <Eye className="w-3 h-3" /> View Invoice
                            </a>
                        ) : <span className="text-xs text-gray-400">No file</span>}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleApprove(c._id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Approve">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(c._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Reject">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}