'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, MapPin } from 'lucide-react';

interface LocationDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'country' | 'state' | 'city' | 'all';
  country?: string;
  state?: string;
  disabled?: boolean;
}

interface LocationOption {
  type: 'country' | 'state' | 'city';
  name: string;
  value: string;
  country?: string;
  state?: string;
}

export default function LocationDropdown({
  value,
  onChange,
  placeholder = "Select location...",
  className = "",
  type = "all",
  country,
  state,
  disabled = false
}: LocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch location data based on type
  const fetchLocations = async () => {
    setLoading(true);
    try {
      let url = '';
      
      if (type === 'country') {
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/locations/countries`;
      } else if (type === 'state' && country) {
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/locations/states?country=${encodeURIComponent(country)}`;
      } else if (type === 'city' && state) {
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/locations/cities?state=${encodeURIComponent(state)}`;
      } else {
        // For 'all' type, get popular cities
        url = `${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/locations/popular-cities`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      const data = await response.json();
      
      // Transform data to LocationOption format
      const transformedOptions: LocationOption[] = data.map((item: string) => ({
        type: type as 'country' | 'state' | 'city',
        name: item,
        value: item
      }));
      
      setOptions(transformedOptions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Search locations
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      fetchLocations();
      return;
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/locations/search?query=${encodeURIComponent(query)}&limit=20`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search locations');
      
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen, type, country, state]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchLocations(query);
  };

  const handleOptionClick = (option: LocationOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
                  Loading locations...
                </p>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={`${option.type}-${index}`}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-900 text-sm"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{option.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
                  No locations found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 