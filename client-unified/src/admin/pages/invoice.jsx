import React, { useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";
import {
  adminGetPendingClaims,
  adminApproveClaim,
  adminRejectClaim,
} from "../api/api";

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
    fetchClaims(); // refresh after update
  }

  async function handleReject(id) {
    await adminRejectClaim(id);
    fetchClaims();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Pending Claims</h1>
      {loading ? (
        <p>Loading...</p>
      ) : claims.length === 0 ? (
        <p>No pending claims 🎉</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 text-sm">User</th>
                <th className="px-4 py-2 text-sm">Email</th>
                <th className="px-4 py-2 text-sm">Cafe</th>
                <th className="px-4 py-2 text-sm">Amount</th>
                <th className="px-4 py-2 text-sm">Status</th>
                <th className="px-4 py-2 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-3">{c.user?.name}</td>
                  <td className="px-4 py-3">{c.user?.email}</td>
                  <td className="px-4 py-3">{c.cafe?.name}</td>
                  <td className="px-4 py-3">₹ {c.amount}</td>
                  <td className="px-4 py-3 capitalize">{c.status}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleApprove(c._id)}
                      className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(c._id)}
                      className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                    {c.invoiceUrl && (
                      <a
                        href={c.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded border hover:bg-gray-100"
                        title="View Invoice"
                      >
                        <Eye size={16} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
