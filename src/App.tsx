import { useState, useMemo, useEffect } from 'react';
import { MapPin, TrendingUp, Heart, Star, Sparkles, Zap, Coffee } from 'lucide-react';
import MapView from './components/MapView';
import SearchAndFilter from './components/SearchAndFilter';
import BarList from './components/BarList';
import type { CocktailBar, FilterOptions, UserPreferences } from './types';
import { sampleBars } from './data/sampleData';
import { getRecommendations, getTrendingBars, getDefaultUserPreferences } from './utils/recommendations';
import { CocktailBarService } from './services';

const LA_CENTER: [number, number] = [34.0522, -118.2437];
const cocktailBarService = new CocktailBarService();

function App() {
  const [selectedBar, setSelectedBar] = useState<CocktailBar | null>(null);
  const [showBarList, setShowBarList] = useState(false);
  const [bars, setBars] = useState<CocktailBar[]>(sampleBars);
  const [loading, setLoading] = useState(false);
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

  // Load bars from API on component mount
  useEffect(() => {
    const loadBars = async () => {
      setLoading(true);
      try {
        const apiBars = await cocktailBarService.fetchBarsNearLocation(
          LA_CENTER[0], 
          LA_CENTER[1], 
          10000 // 10km radius
        );
        setBars(apiBars);
      } catch (error) {
        console.error('Failed to load bars from API:', error);
        // Keep sample bars as fallback
      } finally {
        setLoading(false);
      }
    };

    loadBars();
  }, []);

  const filteredBars = useMemo(() => {
    let filteredBars = bars;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBars = filteredBars.filter(bar => 
        bar.name.toLowerCase().includes(searchLower) ||
        bar.address.toLowerCase().includes(searchLower) ||
        bar.description?.toLowerCase().includes(searchLower) ||
        bar.cocktailTypes.some(ct => ct.name.toLowerCase().includes(searchLower)) ||
        bar.atmosphere.some(a => a.toLowerCase().includes(searchLower))
      );
    }

    if (filters.priceRange.length < 4) {
      filteredBars = filteredBars.filter(bar => filters.priceRange.includes(bar.priceRange));
    }

    if (filters.rating > 0) {
      filteredBars = filteredBars.filter(bar => bar.rating >= filters.rating);
    }

    if (filters.cocktailTypes.length > 0) {
      filteredBars = filteredBars.filter(bar =>
        bar.cocktailTypes.some(ct => filters.cocktailTypes.includes(ct.name))
      );
    }

    if (filters.atmosphere.length > 0) {
      filteredBars = filteredBars.filter(bar =>
        bar.atmosphere.some(a => filters.atmosphere.includes(a))
      );
    }

    if (filters.isOpen) {
      filteredBars = filteredBars.filter(bar => {
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

    return filteredBars;
  }, [filters, bars]);

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
    setShowBarList(true); // Show the bar list when a marker is clicked
  };

  const handleToggleFavorite = (barId: string) => {
    setFavoriteIds(prev => 
      prev.includes(barId) 
        ? prev.filter(id => id !== barId)
        : [...prev, barId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 via-blue-50 to-cyan-100 animate-gradient-x">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500/90 via-purple-600/90 via-blue-600/90 to-cyan-500/90 backdrop-blur-lg border-b border-white/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <span className="text-3xl">🍸</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                <Sparkles className="absolute -top-2 -left-2 w-5 h-5 text-yellow-300 animate-spin" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                  LA Cocktail Finder
                </h1>
                <p className="text-white/90 text-sm mt-1 font-medium">🌟 Discover magical cocktail experiences in Los Angeles ✨</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {loading && (
                <div className="flex items-center space-x-2 text-white/90">
                  <Zap className="w-5 h-5 animate-bounce text-yellow-300" />
                  <span className="font-medium">Loading amazing bars...</span>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{displayBars.length} 🍹 bars found</p>
                  <p className="text-white/80 text-sm">
                    ❤️ {favoriteIds.length} favorite{favoriteIds.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchAndFilter filters={filters} onFiltersChange={setFilters} />

        <div className={`grid grid-cols-1 ${showBarList ? 'lg:grid-cols-12' : ''} gap-8`}>
          {showBarList && (
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-cyan-400/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30">
                <div className="flex p-3 bg-white/10 rounded-t-3xl backdrop-blur-sm">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${
                      activeTab === 'all'
                        ? 'text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl transform scale-[0.95] border-2 border-white/50'
                        : 'text-gray-700 hover:text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    🎯 All Bars ({filteredBars.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('trending')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl flex items-center justify-center space-x-2 ${
                      activeTab === 'trending'
                        ? 'text-white bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 shadow-2xl transform scale-[0.95] border-2 border-white/50'
                        : 'text-gray-700 hover:text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>🔥 Trending</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('recommended')}
                    className={`flex-1 px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl flex items-center justify-center space-x-2 ${
                      activeTab === 'recommended'
                        ? 'text-white bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 shadow-2xl transform scale-[0.95] border-2 border-white/50'
                        : 'text-gray-700 hover:text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    <span>✨ For You</span>
                  </button>
                </div>
                
                <div className="p-4">
                  <button
                    onClick={() => setShowBarList(false)}
                    className="mb-4 w-full px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-medium rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    ✖️ Hide List - Show Map Only
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                <BarList
                  bars={displayBars}
                  selectedBar={selectedBar}
                  onBarSelect={handleBarSelect}
                  onToggleFavorite={handleToggleFavorite}
                  favoriteIds={favoriteIds}
                />
              </div>
            </div>
          )}

          <div className={showBarList ? 'lg:col-span-7' : 'col-span-1'}>
            {!showBarList && (
              <div className="mb-8 text-center">
                <div className="bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex justify-center space-x-4 mb-6">
                    <span className="text-4xl animate-bounce">🍸</span>
                    <span className="text-4xl animate-bounce" style={{animationDelay: '0.1s'}}>🍹</span>
                    <span className="text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>🥃</span>
                    <span className="text-4xl animate-bounce" style={{animationDelay: '0.3s'}}>🍷</span>
                  </div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    🎯 Click on cocktail markers to explore bars!
                  </h2>
                  <p className="text-gray-600 text-lg font-medium mb-6">
                    ✨ Discover amazing cocktail experiences around Los Angeles
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Coffee className="w-6 h-6 text-purple-500 animate-pulse" />
                    <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                    <Zap className="w-6 h-6 text-cyan-500 animate-pulse" />
                  </div>
                </div>
              </div>
            )}
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
