import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { CocktailBar } from '../types';

interface MapViewProps {
  bars: CocktailBar[];
  selectedBar: CocktailBar | null;
  onBarSelect: (bar: CocktailBar) => void;
  center: [number, number];
  zoom: number;
}

const customIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ selectedBar }: { selectedBar: CocktailBar | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedBar) {
      map.setView([selectedBar.latitude, selectedBar.longitude], 16, {
        animate: true,
        duration: 0.5
      });
    }
  }, [selectedBar, map]);

  return null;
}

const MapView: React.FC<MapViewProps> = ({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  center, 
  zoom 
}) => {
  const formatPriceRange = (priceRange: number) => {
    return '$'.repeat(priceRange);
  };

  const formatHours = (hours: CocktailBar['openHours']) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    
    if (todayHours?.closed) {
      return 'Closed today';
    }
    
    if (todayHours) {
      return `Today: ${todayHours.open} - ${todayHours.close}`;
    }
    
    return 'Hours not available';
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController selectedBar={selectedBar} />
      
      {bars.map((bar) => (
        <Marker
          key={bar.id}
          position={[bar.latitude, bar.longitude]}
          icon={selectedBar?.id === bar.id ? selectedIcon : customIcon}
          eventHandlers={{
            click: () => onBarSelect(bar)
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-900">{bar.name}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">{bar.address}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{bar.rating}</span>
                  <span className="text-sm text-gray-500">{formatPriceRange(bar.priceRange)}</span>
                </div>
                <p className="text-xs text-gray-500">{formatHours(bar.openHours)}</p>
                {bar.description && (
                  <p className="text-sm text-gray-700 mt-2">{bar.description}</p>
                )}
                <div className="mt-2">
                  {bar.cocktailTypes.slice(0, 3).map((cocktail, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mt-1"
                    >
                      {cocktail.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;