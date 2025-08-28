import { GooglePlacesService } from './placesApi';
import { YelpService } from './yelpApi';
import { sampleBars } from '../data/sampleData';
import type { CocktailBar } from '../types';

export class CocktailBarService {
  private googlePlaces: GooglePlacesService;
  private yelp: YelpService;
  
  constructor() {
    this.googlePlaces = new GooglePlacesService();
    this.yelp = new YelpService();
  }

  async fetchBarsNearLocation(lat: number, lng: number, radius: number = 5000): Promise<CocktailBar[]> {
    const bars: CocktailBar[] = [];
    
    try {
      // Try to fetch from both APIs
      const [googleBars, yelpBars] = await Promise.allSettled([
        this.googlePlaces.searchBarsNearLocation(lat, lng, radius),
        this.yelp.searchBarsNearLocation(lat, lng, radius)
      ]);

      // Add Google Places results
      if (googleBars.status === 'fulfilled') {
        bars.push(...googleBars.value);
      }

      // Add Yelp results, avoiding duplicates
      if (yelpBars.status === 'fulfilled') {
        const existingNames = new Set(bars.map(b => b.name.toLowerCase()));
        const uniqueYelpBars = yelpBars.value.filter(
          bar => !existingNames.has(bar.name.toLowerCase())
        );
        bars.push(...uniqueYelpBars);
      }

      // If no API results, use sample data
      if (bars.length === 0) {
        console.log('No API results, using sample data');
        return sampleBars;
      }

      // Sort by rating and limit results
      return bars
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 20);
        
    } catch (error) {
      console.error('Error fetching bars from APIs:', error);
      return sampleBars;
    }
  }

  async enrichBarWithDetails(bar: CocktailBar): Promise<CocktailBar> {
    try {
      const [googleDetails, yelpDetails] = await Promise.allSettled([
        this.googlePlaces.getPlaceDetails(bar.id),
        this.yelp.getBusinessDetails(bar.id)
      ]);

      let enrichedBar = { ...bar };

      // Merge Google Places details
      if (googleDetails.status === 'fulfilled' && googleDetails.value) {
        enrichedBar = { ...enrichedBar, ...googleDetails.value };
      }

      // Merge Yelp details
      if (yelpDetails.status === 'fulfilled' && yelpDetails.value) {
        enrichedBar = { ...enrichedBar, ...yelpDetails.value };
      }

      return enrichedBar;
    } catch (error) {
      console.error('Error enriching bar details:', error);
      return bar;
    }
  }

  // Method to check if APIs are configured
  isConfigured(): { google: boolean; yelp: boolean } {
    return {
      google: !!import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      yelp: !!import.meta.env.VITE_YELP_API_KEY
    };
  }
}