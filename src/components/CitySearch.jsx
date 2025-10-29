import React from 'react';
import { Search, Loader } from 'lucide-react';

export default function CitySearch({ cityInput, setCityInput, onSearch, isLoading }) {
  return (
    <form onSubmit={onSearch} className="mb-10">
      <div className="flex shadow-lg rounded-xl overflow-hidden">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Enter city (e.g., Tokyo, New York, Indore)"
          className="flex-grow p-4 text-lg text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
          aria-label="City search input"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white transition duration-150 flex items-center justify-center disabled:opacity-50"
          aria-label="Search weather"
        >
          {isLoading ? <Loader className="animate-spin" size={20} /> : <Search size={20} />}
        </button>
      </div>
    </form>
  );
}
