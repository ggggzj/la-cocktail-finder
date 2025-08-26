import React from 'react';
import { Phone, Globe, MapPin, Star, Clock, Heart } from 'lucide-react';
import type { CocktailBar } from '../types';

interface BarListProps {
  bars: CocktailBar[];
  selectedBar: CocktailBar | null;
  onBarSelect: (bar: CocktailBar) => void;
  onToggleFavorite: (barId: string) => void;
  favoriteIds: string[];
}

const BarList: React.FC<BarListProps> = ({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  onToggleFavorite,
  favoriteIds 
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

  if (bars.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">No bars found matching your criteria</p>
        <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bars.map((bar) => (
        <div
          key={bar.id}
          onClick={() => onBarSelect(bar)}
          className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
            selectedBar?.id === bar.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{bar.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{bar.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{formatPriceRange(bar.priceRange)}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className={isOpenNow(bar.openHours) ? 'text-green-600' : 'text-red-600'}>
                    {isOpenNow(bar.openHours) ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{formatHours(bar.openHours)}</p>
              <div className="flex items-start space-x-1 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{bar.address}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(bar.id);
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart 
                className={`w-5 h-5 ${
                  favoriteIds.includes(bar.id) 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400'
                }`} 
              />
            </button>
          </div>

          {bar.description && (
            <p className="text-sm text-gray-700 mb-3">{bar.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {bar.cocktailTypes.slice(0, 4).map((cocktail, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {cocktail.name}
              </span>
            ))}
            {bar.cocktailTypes.length > 4 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{bar.cocktailTypes.length - 4} more
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {bar.atmosphere.slice(0, 3).map((mood, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {mood}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex space-x-3">
              {bar.phoneNumber && (
                <a
                  href={`tel:${bar.phoneNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
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
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {bar.reviews.length} review{bar.reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarList;