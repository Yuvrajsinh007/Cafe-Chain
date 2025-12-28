import React, { useState } from "react";
import { Search } from "lucide-react";

export default function UserSearch({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        onSearch(newQuery); 
    };

    return (
        <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                placeholder="Search users by name or phone..."
                value={query}
                onChange={handleInputChange}
            />
        </div>
    );
}