"use client";

import React, { useState, useEffect, useRef } from 'react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
}

export function LocationAutocomplete({ 
  value, 
  onChange, 
  className = "", 
  placeholder = "Search for a location...",
  id,
  name,
  required = false
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external value if it changes
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    // Only search if the user typed something and it differs from the current exact value
    // (Prevents searching right after selecting a dropdown item)
    if (!query || query.length < 3 || query === value) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9"
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Location search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce to comply with OSM rate limits (1 req/sec)

    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (result: NominatimResult) => {
    const formattedLocation = result.display_name.split(',').slice(0, 3).join(',').trim();
    setQuery(formattedLocation);
    onChange(formattedLocation);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange(e.target.value); // Let parent know it's changing, even if not fully selected
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        id={id}
        name={name}
        required={required}
        value={query}
        onChange={handleInputChange}
        onFocus={() => { if (results.length > 0) setIsOpen(true) }}
        className={`w-full ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      )}

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden text-sm">
          {results.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 text-slate-700 font-medium transition-colors"
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
