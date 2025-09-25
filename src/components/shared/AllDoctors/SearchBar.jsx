"use client";
import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const MedicalSearchBar = () => {
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('Location');
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA'
  ];

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setIsLocationOpen(false);
  };

  const handleSearch = () => {
    console.log('Searching for:', { specialization, location });
    // Handle search logic here
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Specialization Search */}
          <div className="flex-1  relative">
            <div className="flex items-center  px-4 py-4 md:py-6  border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full text-gray-700 placeholder-gray-500 text-base md:text-lg font-medium bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="relative flex-1">
            <div className="flex items-center  px-4 py-4 md:py-6 border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex-1 flex items-center justify-between text-left"
              >
                <span className={`text-base md:text-lg font-medium ${
                  location === 'Location' ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {location}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isLocationOpen ? 'transform rotate-180' : ''
                }`} />
              </button>
            </div>

            {/* Location Dropdown Menu */}
            {isLocationOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {locations.map((loc, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(loc)}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="md:w-auto">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base md:text-lg px-6 py-4 md:py-6 md:px-8 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Search suggestions or recent searches */}
      <div className="mt-4 px-2">
        <div className="flex flex-wrap gap-2">
          {['Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist'].map((spec, index) => (
            <button
              key={index}
              onClick={() => setSpecialization(spec)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-full transition-colors duration-150"
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalSearchBar;