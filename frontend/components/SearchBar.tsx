'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    placeholder?: string;
    initialValue?: string;
    className?: string;
    basePath?: string;
}

interface AutocompleteResult {
    name: string;
    title: string;
    match_field: string;
    match_displayed: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    placeholder = "Doorzoek Data4OOV (bijv. Water)...",
    initialValue = "",
    className = "",
    basePath = "/dataset"
}) => {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.result || []);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error("Autocomplete error:", err);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                e.preventDefault();
                const selected = suggestions[activeSuggestionIndex];
                setQuery(selected.title || selected.name);
                setShowSuggestions(false);
                router.push(`${basePath}/${encodeURIComponent(selected.name)}`);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (query.trim()) {
            router.push(`${basePath}?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleSuggestionClick = (selected: AutocompleteResult) => {
        setQuery(selected.title || selected.name);
        setShowSuggestions(false);
        router.push(`${basePath}/${encodeURIComponent(selected.name)}`);
    };

    return (
        <div ref={wrapperRef} className={`relative max-w-2xl mx-auto ${className}`}>
            <form onSubmit={handleSearch} className="relative w-full">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveSuggestionIndex(-1);
                    }}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-full border border-gray-200 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    autoComplete="off"
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-brand-blue text-white px-6 rounded-full font-medium hover:bg-opacity-90 transition-all"
                >
                    Zoeken
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg left-0 max-h-80 overflow-y-auto">
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li 
                                key={suggestion.name}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`px-6 py-3 cursor-pointer text-left transition-colors flex flex-col ${
                                    index === activeSuggestionIndex 
                                        ? 'bg-blue-50 text-brand-blue' 
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <span className="font-semibold text-sm">{suggestion.title || suggestion.name}</span>
                                {suggestion.name !== suggestion.title && suggestion.title && (
                                    <span className="text-xs text-gray-500 mt-0.5">{suggestion.name}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
