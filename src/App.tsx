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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍸</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  LA Cocktail Finder
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Discover the best cocktail bars in Los Angeles</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{displayBars.length} bars found</p>
                <p className="text-xs text-gray-500">
                  {favoriteIds.length} favorite{favoriteIds.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchAndFilter filters={filters} onFiltersChange={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="flex p-2 bg-gray-50/50 rounded-t-2xl">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                    activeTab === 'all'
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg transform scale-[0.98]'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  All Bars ({filteredBars.length})
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl flex items-center justify-center space-x-1 ${
                    activeTab === 'trending'
                      ? 'text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-lg transform scale-[0.98]'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </button>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl flex items-center justify-center space-x-1 ${
                    activeTab === 'recommended'
                      ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg transform scale-[0.98]'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
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
            <div className="h-[700px] relative">
              <MapView
                bars={displayBars}
                selectedBar={selectedBar}
                onBarSelect={handleBarSelect}
                center={selectedBar ? [selectedBar.latitude, selectedBar.longitude] : LA_CENTER}
                zoom={selectedBar ? 16 : 12}
              />
              
              {/* Map overlay info */}
              {selectedBar && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 max-w-xs z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{selectedBar.name}</h3>
                    <button
                      onClick={() => setSelectedBar(null)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{selectedBar.address}</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{selectedBar.rating}</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      {'$'.repeat(selectedBar.priceRange)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {favoriteIds.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-current" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Favorites
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-sm font-medium rounded-full">
                {favoriteIds.length} place{favoriteIds.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteIds.map(id => {
                const bar = sampleBars.find(b => b.id === id);
                if (!bar) return null;
                return (
                  <div
                    key={id}
                    onClick={() => handleBarSelect(bar)}
                    className="group p-5 border border-white/40 rounded-2xl cursor-pointer bg-gradient-to-br from-white/60 to-white/40 hover:from-white/80 hover:to-white/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {bar.name}
                      </h3>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">{bar.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{bar.rating}</span>
                      </div>
                      <div className="flex space-x-1">
                        {bar.cocktailTypes.slice(0, 2).map((cocktail, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {cocktail.name}
                          </span>
                        ))}
                      </div>
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
