import React from "react";
import { format } from 'date-fns';

export default function CafeTable({ cafes, onRowClick, approvalMode = false }) {
  return (
    <table className="w-full bg-white rounded-lg shadow overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-3 text-left font-semibold text-gray-600">Name</th>
          <th className="p-3 text-left font-semibold text-gray-600">Address</th>
          <th className="p-3 text-left font-semibold text-gray-600">{approvalMode ? "Submission Date" : "Status"}</th>
        </tr>
      </thead>
      <tbody>
        {cafes.map((cafe) => (
          <tr
            key={cafe._id} // Use the database ID
            className="hover:bg-gray-100 cursor-pointer border-t"
            onClick={() => onRowClick(cafe)}
          >
            <td className="p-3">{cafe.name}</td>
            <td className="p-3">{cafe.address}</td>
            <td className="p-3">
              {approvalMode ? (
                // ✅ FIXED: Check if createdAt exists before formatting
                cafe.createdAt ? format(new Date(cafe.createdAt), 'PP') : 'N/A'
              ) : (
                // Display status with a colored badge
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    cafe.status === 'active' ? 'bg-green-100 text-green-800' : 
                    cafe.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {cafe.status.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}