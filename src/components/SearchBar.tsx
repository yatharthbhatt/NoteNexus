import React, { useState } from 'react';
import { Search, X, Filter, SortAsc } from 'lucide-react';
import { AppState } from '../types';

interface SearchBarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ state, setState }) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearSearch = () => {
    setState(prev => ({ ...prev, searchQuery: '' }));
  };

  const clearFilters = () => {
    setState(prev => ({ ...prev, selectedLabels: [] }));
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={state.searchQuery}
            onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          {state.searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <SortAsc className="w-4 h-4" />
            Sort
          </button>

          {state.selectedLabels.length > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear filters ({state.selectedLabels.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;