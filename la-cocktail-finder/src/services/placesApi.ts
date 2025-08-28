import type { CocktailBar } from '../types';

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Google Places API service
export class GooglePlacesService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = GOOGLE_PLACES_API_KEY || '';
  }

  async searchBarsNearLocation(lat: number, lng: number, radius: number = 5000): Promise<CocktailBar[]> {
    if (!this.apiKey) {
      console.warn('Google Places API key not found, using sample data');
      return [];
    }

    try {
      const url = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=bar&keyword=cocktail|lounge|speakeasy&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status}`);
      }

      return this.transformPlacesToBars(data.results);
    } catch (error) {
      console.error('Error fetching from Google Places:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<Partial<CocktailBar> | null> {
    if (!this.apiKey) return null;

    try {
      const url = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,photos,price_level,rating,reviews&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Place Details API error: ${data.status}`);
      }

      return this.transformPlaceDetailsToBar(data.result);
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  private transformPlacesToBars(places: any[]): CocktailBar[] {
    return places.map((place, index) => ({
      id: place.place_id || `google-${index}`,
      name: place.name || 'Unknown Bar',
      address: place.vicinity || 'Address not available',
      latitude: place.geometry?.location?.lat || 0,
      longitude: place.geometry?.location?.lng || 0,
      rating: place.rating || 4.0,
      priceRange: this.mapPriceLevel(place.price_level),
      phoneNumber: place.formatted_phone_number,
      website: place.website,
      description: place.editorial_summary?.overview || 'Cocktail bar and lounge',
      imageUrl: place.photos?.[0] ? this.getPhotoUrl(place.photos[0].photo_reference) : undefined,
      openHours: this.mapOpeningHours(place.opening_hours),
      features: this.extractFeatures(place),
      cocktailTypes: this.generateCocktailTypes(),
      atmosphere: this.generateAtmosphere(place.name, place.types),
      reviews: []
    }));
  }

  private transformPlaceDetailsToBar(place: any): Partial<CocktailBar> {
    return {
      phoneNumber: place.formatted_phone_number,
      website: place.website,
      openHours: this.mapOpeningHours(place.opening_hours),
      reviews: place.reviews?.map((review: any, index: number) => ({
        id: `review-${index}`,
        userName: review.author_name || 'Anonymous',
        rating: review.rating || 4,
        comment: review.text || '',
        date: new Date(review.time * 1000).toISOString().split('T')[0],
        helpful: Math.floor(Math.random() * 20)
      })) || []
    };
  }

  private mapPriceLevel(priceLevel?: number): 1 | 2 | 3 | 4 {
    if (!priceLevel) return 2;
    return Math.min(Math.max(priceLevel, 1), 4) as 1 | 2 | 3 | 4;
  }

  private mapOpeningHours(openingHours?: any): CocktailBar['openHours'] {
    if (!openingHours?.weekday_text) {
      return this.getDefaultHours();
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hours: any = {};

    openingHours.weekday_text.forEach((dayText: string, index: number) => {
      const day = days[index];
      if (dayText.includes('Closed')) {
        hours[day] = { closed: true, open: '', close: '' };
      } else {
        const match = dayText.match(/(\d{1,2}:\d{2})\s*(AM|PM).*?(\d{1,2}:\d{2})\s*(AM|PM)/);
        if (match) {
          hours[day] = {
            open: this.convertTo24Hour(match[1], match[2]),
            close: this.convertTo24Hour(match[3], match[4])
          };
        } else {
          hours[day] = { open: '17:00', close: '02:00' };
        }
      }
    });

    return hours;
  }

  private convertTo24Hour(time: string, period: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private getDefaultHours(): CocktailBar['openHours'] {
    return {
      monday: { closed: true, open: '', close: '' },
      tuesday: { open: '17:00', close: '02:00' },
      wednesday: { open: '17:00', close: '02:00' },
      thursday: { open: '17:00', close: '02:00' },
      friday: { open: '17:00', close: '02:00' },
      saturday: { open: '17:00', close: '02:00' },
      sunday: { open: '17:00', close: '24:00' }
    };
  }

  private getPhotoUrl(photoReference: string): string {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  private extractFeatures(place: any): string[] {
    const features: string[] = [];
    const types = place.types || [];
    
    if (types.includes('night_club')) features.push('nightlife');
    if (types.includes('restaurant')) features.push('dining');
    if (place.name?.toLowerCase().includes('rooftop')) features.push('rooftop');
    if (place.name?.toLowerCase().includes('speakeasy')) features.push('speakeasy');
    if (place.rating >= 4.5) features.push('highly rated');
    
    return features.length > 0 ? features : ['cocktails', 'bar'];
  }

  private generateCocktailTypes(): Array<{name: string, popularity: number}> {
    const cocktailOptions = ['whiskey', 'gin', 'vodka', 'rum', 'tequila', 'mezcal', 'brandy', 'bourbon'];
    const selected = cocktailOptions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 3));
    
    return selected.map(name => ({
      name,
      popularity: 6 + Math.floor(Math.random() * 4)
    }));
  }

  private generateAtmosphere(name: string, types: string[] = []): string[] {
    const atmosphere: string[] = [];
    const nameUpper = name.toUpperCase();
    
    if (nameUpper.includes('ROOFTOP')) atmosphere.push('rooftop');
    if (nameUpper.includes('LOUNGE')) atmosphere.push('upscale', 'sophisticated');
    if (nameUpper.includes('SPEAKEASY')) atmosphere.push('intimate', 'vintage');
    if (types.includes('night_club')) atmosphere.push('lively', 'dancing');
    
    const defaultAtmospheres = ['intimate', 'upscale', 'casual', 'sophisticated', 'lively'];
    const additionalCount = 2 - atmosphere.length;
    
    if (additionalCount > 0) {
      const additional = defaultAtmospheres
        .filter(a => !atmosphere.includes(a))
        .sort(() => 0.5 - Math.random())
        .slice(0, additionalCount);
      atmosphere.push(...additional);
    }
    
    return atmosphere;
  }
}