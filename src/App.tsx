import { useState, useMemo } from 'react';
import { MapPin, TrendingUp, Heart, Star } from 'lucide-react';
import MapView from './components/MapView';
import SearchAndFilter from './components/SearchAndFilter';
import BarList from './components/BarList';
import type { CocktailBar, FilterOptions, UserPreferences } from './types';
import { sampleBars } from './data/sampleData';
import { getRecommendations, getTrendingBars, getDefaultUserPreferences } from './utils/recommendations';

const LA_CENTER: [number, number] = [34.0522, -118.2437];

function App() {
  const [selectedBar, setSelectedBar] = useState<CocktailBar | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priceRange: [1, 2, 3, 4],
    rating: 0,
    cocktailTypes: [],
    atmosphere: [],
    isOpen: false,
    location: null
  });
  
  const [userPreferences] = useState<UserPreferences>(getDefaultUserPreferences());
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recommended'>('all');

  const filteredBars = useMemo(() => {
    let bars = sampleBars;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      bars = bars.filter(bar => 
        bar.name.toLowerCase().includes(searchLower) ||
        bar.address.toLowerCase().includes(searchLower) ||
        bar.description?.toLowerCase().includes(searchLower) ||
        bar.cocktailTypes.some(ct => ct.name.toLowerCase().includes(searchLower)) ||
        bar.atmosphere.some(a => a.toLowerCase().includes(searchLower))
      );
    }

    if (filters.priceRange.length < 4) {
      bars = bars.filter(bar => filters.priceRange.includes(bar.priceRange));
    }

    if (filters.rating > 0) {
      bars = bars.filter(bar => bar.rating >= filters.rating);
    }

    if (filters.cocktailTypes.length > 0) {
      bars = bars.filter(bar =>
        bar.cocktailTypes.some(ct => filters.cocktailTypes.includes(ct.name))
      );
    }

    if (filters.atmosphere.length > 0) {
      bars = bars.filter(bar =>
        bar.atmosphere.some(a => filters.atmosphere.includes(a))
      );
    }

    if (filters.isOpen) {
      bars = bars.filter(bar => {
        const now = new Date();
        const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        
        const todayHours = bar.openHours[today];
        if (!todayHours || todayHours.closed) return false;
        
        const openTime = parseInt(todayHours.open.replace(':', ''));
        const closeTime = parseInt(todayHours.close.replace(':', ''));
        
        if (closeTime < openTime) {
          return currentTime >= openTime || currentTime <= closeTime;
        }
        
        return currentTime >= openTime && currentTime <= closeTime;
      });
    }

    return bars;
  }, [filters]);

  const displayBars = useMemo(() => {
    switch (activeTab) {
      case 'trending':
        return getTrendingBars(filteredBars, 10);
      case 'recommended':
        const recommendations = getRecommendations(filteredBars, userPreferences, favoriteIds, 10);
        return recommendations.map(r => r.bar);
      default:
        return filteredBars;
    }
  }, [activeTab, filteredBars, userPreferences, favoriteIds]);

  const handleBarSelect = (bar: CocktailBar) => {
    setSelectedBar(bar);
  };

  const handleToggleFavorite = (barId: string) => {
    setFavoriteIds(prev => 
      prev.includes(barId) 
        ? prev.filter(id => id !== barId)
        : [...prev, barId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <MapPin className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">LA Cocktail Finder</h1>
            </div>
            <div className="text-sm text-gray-500">
              Discover the best cocktail bars in Los Angeles
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchAndFilter filters={filters} onFiltersChange={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Bars ({filteredBars.length})
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                    activeTab === 'trending'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </button>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                    activeTab === 'recommended'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>For You</span>
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              <BarList
                bars={displayBars}
                selectedBar={selectedBar}
                onBarSelect={handleBarSelect}
                onToggleFavorite={handleToggleFavorite}
                favoriteIds={favoriteIds}
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
              <MapView
                bars={displayBars}
                selectedBar={selectedBar}
                onBarSelect={handleBarSelect}
                center={selectedBar ? [selectedBar.latitude, selectedBar.longitude] : LA_CENTER}
                zoom={selectedBar ? 16 : 11}
              />
            </div>
          </div>
        </div>

        {favoriteIds.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <h2 className="text-lg font-semibold text-gray-900">
                Your Favorites ({favoriteIds.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteIds.map(id => {
                const bar = sampleBars.find(b => b.id === id);
                if (!bar) return null;
                return (
                  <div
                    key={id}
                    onClick={() => handleBarSelect(bar)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{bar.name}</h3>
                    <p className="text-sm text-gray-600">{bar.address}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{bar.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
