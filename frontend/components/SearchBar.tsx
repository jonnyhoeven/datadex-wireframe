'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    placeholder?: string;
    initialValue?: string;
    className?: string;
    basePath?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    placeholder = "Doorzoek Data4OOV (bijv. Water)...",
    initialValue = "",
    className = "",
    basePath = "/dataset"
}) => {
    const [query, setQuery] = useState(initialValue);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`${basePath}?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`relative max-w-2xl mx-auto ${className}`}>
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-full border border-gray-200 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#004562] focus:border-transparent"
            />
            <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[#004562] text-white px-6 rounded-full font-medium hover:bg-opacity-90 transition-all"
            >
                Zoeken
            </button>
        </form>
    );
};

export default SearchBar;
