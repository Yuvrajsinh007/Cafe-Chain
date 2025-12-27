import React, { useState } from "react";

export default function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Global Announcement</h2>
      <input
        className="border px-2 py-1 rounded mb-2 w-full"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="border px-2 py-1 rounded mb-2 w-full"
        placeholder="Message Body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => alert("Announcement sent!")}
      >
        Push Announcement
      </button>
    </div>
  );
}