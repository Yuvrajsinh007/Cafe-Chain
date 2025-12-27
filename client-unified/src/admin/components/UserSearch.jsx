import React, { useState } from "react";

export default function UserSearch({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        // Pass the search query to the parent component in real-time
        onSearch(newQuery); 
    };

    return (
        <div className="flex gap-2 bg-white p-4 rounded-lg shadow">
            <input
                className="border px-3 py-2 rounded-lg w-full"
                placeholder="Search by name or phone number..."
                value={query}
                onChange={handleInputChange}
            />
            {/* The search button is no longer necessary for real-time search */}
        </div>
    );
}