"use client";

import React, { useState } from "react";
import { popularDialCodes, countryDialCodes } from "../../lib/countryCodes";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export default function PhoneInput({
  value,
  onChange,
  selectedCountry,
  onCountryChange,
  label = "Phone number",
  required = false,
  placeholder = "(555) 123-4567"
}: PhoneInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countryDialCodes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
  );

  const handlePhoneChange = (inputValue: string) => {
    let cleaned = inputValue;

    // Check if the input starts with +
    if (cleaned.startsWith("+")) {
      // Find matching country code from countryDialCodes
      const sortedCodes = [...countryDialCodes].sort((a, b) => b.code.length - a.code.length);
      
      for (const country of sortedCodes) {
        const normalizedCode = country.code.replace(/[-\s]/g, ""); // e.g. "+1246" or "+1"
        const normalizedInput = cleaned.replace(/[-\s()]/g, "");   // e.g. "+1246555..." or "+1555..."
        
        if (normalizedInput.startsWith(normalizedCode)) {
          // Update the country flag & dial code
          onCountryChange(country);
          
          // Remove the matched dial code from the raw typed input string
          const escapedCodeParts = country.code
            .replace(/[+]/g, "\\+")
            .split("-")
            .map(part => part.split("").join("[\\s-]*"))
            .join("[\\s-]*");
          const regex = new RegExp(`^${escapedCodeParts}[\\s-]*`);
          const match = cleaned.match(regex);
          if (match) {
            cleaned = cleaned.substring(match[0].length);
          }
          break;
        }
      }
    } else if (cleaned.startsWith("0") && cleaned.length >= 4 && selectedCountry.code !== "+1") {
      // If user inputs local format with leading 0 (e.g. 0917...), strip the 0
      cleaned = cleaned.substring(1);
    }
    
    onChange(cleaned);
  };

  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative shrink-0 w-32">
          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs text-left cursor-pointer"
          >
            <span className="truncate">
              {selectedCountry.flag} {selectedCountry.code}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible backdrop to close the dropdown */}
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code..."
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                {/* List of Countries - Fixed Height scrollable box */}
                <div className="overflow-y-auto max-h-48 divide-y divide-gray-50">
                  {/* Popular group (only show when not searching) */}
                  {searchQuery === "" && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                        Popular
                      </div>
                      {popularDialCodes.map((country, idx) => (
                        <button
                          key={`pop-${idx}`}
                          type="button"
                          onClick={() => {
                            onCountryChange(country);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-[#E84E29]/10 ${
                            selectedCountry.code === country.code && selectedCountry.name === country.name
                              ? "bg-[#E84E29]/10 font-semibold text-[#E84E29]"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="font-medium shrink-0">{country.code}</span>
                          <span className="text-xs text-gray-400 truncate">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* All/Filtered list */}
                  <div>
                    {searchQuery === "" && (
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                        All Countries
                      </div>
                    )}
                    {filteredCountries.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-gray-400">
                        No results found
                      </div>
                    ) : (
                      filteredCountries.map((country, idx) => (
                        <button
                          key={`all-${idx}`}
                          type="button"
                          onClick={() => {
                            onCountryChange(country);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-[#E84E29]/10 ${
                            selectedCountry.code === country.code && selectedCountry.name === country.name
                              ? "bg-[#E84E29]/10 font-semibold text-[#E84E29]"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="font-medium shrink-0">{country.code}</span>
                          <span className="text-xs text-gray-400 truncate">{country.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <input
          type="tel"
          name="phone"
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          required={required}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E29]/50 focus:border-transparent transition-all shadow-xs"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
