import React from 'react';
import { Phone, Globe, MapPin, Star, Clock, Heart, Sparkles, Zap } from 'lucide-react';
import type { CocktailBar } from '../types';
import Skeleton from './Skeleton';

interface BarListProps {
  bars: CocktailBar[];
  selectedBar: CocktailBar | null;
  onBarSelect: (bar: CocktailBar) => void;
  onToggleFavorite: (barId: string) => void;
  favoriteIds: string[];
  loading?: boolean;
}

const BarList: React.FC<BarListProps> = ({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  onToggleFavorite,
  favoriteIds,
  loading = false
}) => {
  const formatPriceRange = (priceRange: number) => {
    return '$'.repeat(priceRange);
  };

  const isOpenNow = (hours: CocktailBar['openHours']): boolean => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = hours[today];
    if (!todayHours || todayHours.closed) return false;
    
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    }
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const formatHours = (hours: CocktailBar['openHours']) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    
    if (todayHours?.closed) {
      return 'Closed today';
    }
    
    if (todayHours) {
      return `${todayHours.open} - ${todayHours.close}`;
    }
    
    return 'Hours not available';
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/40">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-3">
                <Skeleton height="h-6" width="w-3/4" />
                <div className="flex items-center space-x-4">
                  <Skeleton height="h-4" width="w-16" />
                  <Skeleton height="h-4" width="w-12" />
                  <Skeleton height="h-4" width="w-20" />
                </div>
                <Skeleton height="h-4" width="w-full" />
              </div>
              <Skeleton height="h-12" width="w-12" className="rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Skeleton height="h-8" width="w-20" className="rounded-full" />
                <Skeleton height="h-8" width="w-24" className="rounded-full" />
                <Skeleton height="h-8" width="w-16" className="rounded-full" />
              </div>
              <div className="flex space-x-2">
                <Skeleton height="h-8" width="w-16" className="rounded-full" />
                <Skeleton height="h-8" width="w-20" className="rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bars.length === 0) {
    return (
      <div className="p-12 text-center bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 rounded-3xl border border-white/40 shadow-xl">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl">
          <div className="space-x-2">
            <span className="text-3xl animate-bounce">🍸</span>
            <span className="text-3xl animate-bounce" style={{animationDelay: '0.1s'}}>🔍</span>
          </div>
        </div>
        <h3 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          No bars found ✨
        </h3>
        <p className="text-gray-600 text-lg font-medium max-w-md mx-auto mb-8">
          We couldn't find any cocktail bars matching your criteria. Try adjusting your filters or search terms to discover new places.
        </p>
        <div className="flex justify-center space-x-6 mb-8">
          <div className="text-center">
            <span className="text-4xl animate-pulse">🍸</span>
            <p className="text-xs text-gray-500 mt-2">Martinis</p>
          </div>
          <div className="text-center">
            <span className="text-4xl animate-pulse" style={{animationDelay: '0.2s'}}>🍹</span>
            <p className="text-xs text-gray-500 mt-2">Cocktails</p>
          </div>
          <div className="text-center">
            <span className="text-4xl animate-pulse" style={{animationDelay: '0.4s'}}>🥃</span>
            <p className="text-xs text-gray-500 mt-2">Whiskey</p>
          </div>
          <div className="text-center">
            <span className="text-4xl animate-pulse" style={{animationDelay: '0.6s'}}>🍷</span>
            <p className="text-xs text-gray-500 mt-2">Wine</p>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          <Zap className="w-6 h-6 text-pink-500 animate-pulse" />
          <Sparkles className="w-6 h-6 text-cyan-500 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {bars.map((bar) => (
        <div
          key={bar.id}
          onClick={() => onBarSelect(bar)}
          className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border ${
            selectedBar?.id === bar.id 
              ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50/50' 
              : 'border-white/40 hover:border-blue-200'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {bar.name}
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isOpenNow(bar.openHours) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isOpenNow(bar.openHours) ? 'OPEN NOW' : 'CLOSED'}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">{bar.rating}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="font-semibold text-green-600">{formatPriceRange(bar.priceRange)}</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatHours(bar.openHours)}</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="leading-relaxed">{bar.address}</span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(bar.id);
              }}
              className="p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
            >
              <Heart 
                className={`w-6 h-6 transition-all ${
                  favoriteIds.includes(bar.id) 
                    ? 'text-red-500 fill-current scale-110' 
                    : 'text-gray-400 group-hover:text-red-400'
                }`} 
              />
            </button>
          </div>

          {bar.description && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl mb-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-700 leading-relaxed">{bar.description}</p>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">COCKTAIL SPECIALTIES</p>
              <div className="flex flex-wrap gap-2">
                {bar.cocktailTypes.slice(0, 4).map((cocktail, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full font-medium"
                  >
                    {cocktail.name}
                  </span>
                ))}
                {bar.cocktailTypes.length > 4 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    +{bar.cocktailTypes.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">ATMOSPHERE</p>
              <div className="flex flex-wrap gap-2">
                {bar.atmosphere.slice(0, 3).map((mood, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white text-xs px-3 py-1.5 rounded-full font-medium"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-4">
              {bar.phoneNumber && (
                <a
                  href={`tel:${bar.phoneNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
              )}
              {bar.website && (
                <a
                  href={bar.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {bar.reviews.length} review{bar.reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarList;