'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface YearDropdownProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  startYear?: number;
  endYear?: number;
}

export default function YearDropdown({
  value,
  onChange,
  placeholder = "Select year...",
  className = "",
  disabled = false,
  startYear = 2024,
  endYear = 2030
}: YearDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate years array
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (year: number) => {
    onChange(year);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 md:px-4 py-2 md:py-3 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
        style={{
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: 400
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleOptionClick(year)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-900 text-sm"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{year}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 