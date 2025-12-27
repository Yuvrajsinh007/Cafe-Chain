import React from "react";
import PromotionsManager from "../components/PromotionsManager";
import AnnouncementForm from "../components/AnnouncementForm";

export default function PromotionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Promotions & Announcements</h1>
      <PromotionsManager />
      <div className="my-8" />
      <AnnouncementForm />
    </div>
  );
}