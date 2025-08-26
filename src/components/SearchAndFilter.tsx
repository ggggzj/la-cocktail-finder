import React, { useState } from 'react';
import { Search, Filter, Star, Clock, DollarSign } from 'lucide-react';
import type { FilterOptions } from '../types';
import { cocktailTypes, atmosphereOptions } from '../data/sampleData';

interface SearchAndFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  const handlePriceRangeChange = (range: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: range
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating
    });
  };

  const handleCocktailTypeToggle = (cocktailType: string) => {
    const newTypes = filters.cocktailTypes.includes(cocktailType)
      ? filters.cocktailTypes.filter(t => t !== cocktailType)
      : [...filters.cocktailTypes, cocktailType];
    
    onFiltersChange({
      ...filters,
      cocktailTypes: newTypes
    });
  };

  const handleAtmosphereToggle = (atmosphere: string) => {
    const newAtmosphere = filters.atmosphere.includes(atmosphere)
      ? filters.atmosphere.filter(a => a !== atmosphere)
      : [...filters.atmosphere, atmosphere];
    
    onFiltersChange({
      ...filters,
      atmosphere: newAtmosphere
    });
  };

  const handleOpenNowToggle = () => {
    onFiltersChange({
      ...filters,
      isOpen: !filters.isOpen
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      priceRange: [1, 4],
      rating: 0,
      cocktailTypes: [],
      atmosphere: [],
      isOpen: false,
      location: null
    });
  };

  const getPriceDisplay = (value: number) => '$'.repeat(value);

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 mb-8 border border-white/20">
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search bars, neighborhoods, or cocktails..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border transition-all duration-200 font-medium ${
            showFilters 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg' 
              : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-white hover:shadow-md'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {showFilters && <span className="w-2 h-2 bg-white rounded-full"></span>}
        </button>
      </div>

      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Price Range</span>
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((price) => (
                  <button
                    key={price}
                    onClick={() => {
                      const newRange = filters.priceRange.includes(price)
                        ? filters.priceRange.filter(p => p !== price)
                        : [...filters.priceRange, price];
                      handlePriceRangeChange(newRange);
                    }}
                    className={`px-3 py-1 text-sm rounded ${
                      filters.priceRange.includes(price)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {getPriceDisplay(price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4" />
                <span>Minimum Rating</span>
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating === filters.rating ? 0 : rating)}
                    className={`w-6 h-6 text-sm ${
                      rating <= filters.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Open Now */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>Availability</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isOpen}
                  onChange={handleOpenNowToggle}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Open now</span>
              </label>
            </div>
          </div>

          {/* Cocktail Types */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Cocktail Types</label>
            <div className="flex flex-wrap gap-2">
              {cocktailTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleCocktailTypeToggle(type)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.cocktailTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Atmosphere */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Atmosphere</label>
            <div className="flex flex-wrap gap-2">
              {atmosphereOptions.map((atmosphere) => (
                <button
                  key={atmosphere}
                  onClick={() => handleAtmosphereToggle(atmosphere)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.atmosphere.includes(atmosphere)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {atmosphere}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;