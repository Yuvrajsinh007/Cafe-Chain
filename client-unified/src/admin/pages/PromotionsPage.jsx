// client-unified/src/admin/pages/PromotionsPage.jsx
import React from "react";
import PromotionsManager from "../components/PromotionsManager";

export default function PromotionsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Promotions Center</h1>
        <p className="text-gray-500 text-sm">Manage global announcements and offers</p>
      </div>
      <PromotionsManager />
    </div>
  );
}