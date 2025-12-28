import React from "react";
import { format } from 'date-fns';
import { MapPin, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function CafeTable({ cafes, onRowClick, approvalMode = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cafe Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                {approvalMode ? "Submission Date" : "Status"}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cafes.map((cafe) => (
              <tr
                key={cafe._id}
                onClick={() => onRowClick(cafe)}
                className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg">
                           {cafe.name.charAt(0)}
                       </div>
                       <div>
                           <div className="font-bold text-gray-800">{cafe.name}</div>
                           <div className="text-xs text-gray-500">{cafe.email}</div>
                       </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-start gap-2 text-gray-600 max-w-xs">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                        <span className="text-sm truncate">{cafe.address}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                  {approvalMode ? (
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {cafe.createdAt ? format(new Date(cafe.createdAt), 'MMM dd, yyyy') : 'N/A'}
                     </div>
                  ) : (
                    <StatusBadge status={cafe.status} />
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                    <span className="text-amber-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
    const styles = {
        active: "bg-green-100 text-green-700 border-green-200",
        pending_approval: "bg-orange-100 text-orange-700 border-orange-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
        inactive: "bg-gray-100 text-gray-700 border-gray-200"
    };

    const icons = {
        active: <CheckCircle2 className="w-3 h-3" />,
        pending_approval: <Clock className="w-3 h-3" />,
        rejected: <XCircle className="w-3 h-3" />,
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.inactive}`}>
            {icons[status]}
            {status?.replace('_', ' ').toUpperCase()}
        </span>
    );
};