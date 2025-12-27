import React from "react";

const dummyCafes = [
  { id: 1, name: "Brew Bros", sponsored: true },
  { id: 2, name: "Bean Scene", sponsored: false },
];

export default function PromotionsManager() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Sponsored Cafes</h2>
      <input className="border px-2 py-1 rounded mb-4 w-full" placeholder="Search cafes..." />
      <ul>
        {dummyCafes.map(cafe => (
          <li key={cafe.id} className="flex items-center justify-between py-2 border-b">
            <span>{cafe.name}</span>
            <button
              className={`px-3 py-1 rounded ${cafe.sponsored ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              {cafe.sponsored ? "Sponsored" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}