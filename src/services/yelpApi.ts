import type { CocktailBar } from '../types';

const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export class YelpService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = YELP_API_KEY || '';
  }

  async searchBarsNearLocation(lat: number, lng: number, radius: number = 5000): Promise<CocktailBar[]> {
    if (!this.apiKey) {
      console.warn('Yelp API key not found, using sample data');
      return [];
    }

    try {
      const url = `${CORS_PROXY}https://api.yelp.com/v3/businesses/search?term=cocktail%20bar&latitude=${lat}&longitude=${lng}&radius=${radius}&categories=bars,cocktailbars&sort_by=rating&limit=20`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Yelp API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformYelpBusinessesToBars(data.businesses);
    } catch (error) {
      console.error('Error fetching from Yelp:', error);
      return [];
    }
  }

  async getBusinessDetails(businessId: string): Promise<Partial<CocktailBar> | null> {
    if (!this.apiKey) return null;

    try {
      const url = `${CORS_PROXY}https://api.yelp.com/v3/businesses/${businessId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Yelp Business Details API error: ${response.status}`);
      }

      const business = await response.json();
      
      // Get reviews separately
      const reviews = await this.getBusinessReviews(businessId);
      
      return this.transformYelpBusinessToBar(business, reviews);
    } catch (error) {
      console.error('Error fetching business details from Yelp:', error);
      return null;
    }
  }

  async getBusinessReviews(businessId: string): Promise<any[]> {
    if (!this.apiKey) return [];

    try {
      const url = `${CORS_PROXY}https://api.yelp.com/v3/businesses/${businessId}/reviews`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Yelp Reviews API error: ${response.status}`);
      }

      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews from Yelp:', error);
      return [];
    }
  }

  private transformYelpBusinessesToBars(businesses: any[]): CocktailBar[] {
    return businesses.map((business, index) => ({
      id: business.id || `yelp-${index}`,
      name: business.name || 'Unknown Bar',
      address: this.formatAddress(business.location),
      latitude: business.coordinates?.latitude || 0,
      longitude: business.coordinates?.longitude || 0,
      rating: business.rating || 4.0,
      priceRange: this.mapYelpPriceRange(business.price),
      phoneNumber: business.display_phone,
      website: business.url,
      description: this.generateDescription(business),
      imageUrl: business.image_url,
      openHours: this.mapYelpHours(business.hours),
      features: this.extractYelpFeatures(business),
      cocktailTypes: this.generateCocktailTypes(),
      atmosphere: this.generateAtmosphereFromYelp(business),
      reviews: []
    }));
  }

  private transformYelpBusinessToBar(business: any, reviews: any[]): Partial<CocktailBar> {
    return {
      phoneNumber: business.display_phone,
      website: business.url,
      openHours: this.mapYelpHours(business.hours),
      reviews: reviews.map((review, index) => ({
        id: `yelp-review-${index}`,
        userName: review.user?.name || 'Anonymous',
        rating: review.rating || 4,
        comment: review.text || '',
        date: review.time_created?.split(' ')[0] || new Date().toISOString().split('T')[0],
        helpful: Math.floor(Math.random() * 15)
      }))
    };
  }

  private formatAddress(location: any): string {
    if (!location) return 'Address not available';
    
    const parts = [
      location.address1,
      location.city,
      location.state,
      location.zip_code
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  private mapYelpPriceRange(price?: string): 1 | 2 | 3 | 4 {
    if (!price) return 2;
    return Math.min(price.length, 4) as 1 | 2 | 3 | 4;
  }

  private mapYelpHours(hours?: any[]): CocktailBar['openHours'] {
    if (!hours || hours.length === 0) {
      return this.getDefaultHours();
    }

    const regularHours = hours.find(h => h.hours_type === 'REGULAR');
    if (!regularHours) {
      return this.getDefaultHours();
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hoursObj: any = {};

    // Initialize all days as closed
    days.forEach(day => {
      hoursObj[day] = { closed: true, open: '', close: '' };
    });

    // Map Yelp hours
    regularHours.open?.forEach((slot: any) => {
      const dayName = days[slot.day];
      if (dayName) {
        hoursObj[dayName] = {
          open: this.convertYelpTime(slot.start),
          close: this.convertYelpTime(slot.end)
        };
      }
    });

    return hoursObj;
  }

  private convertYelpTime(time: string): string {
    if (!time || time.length !== 4) return '17:00';
    
    const hours = time.substring(0, 2);
    const minutes = time.substring(2, 4);
    
    return `${hours}:${minutes}`;
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

  private generateDescription(business: any): string {
    const categories = business.categories?.map((cat: any) => cat.title).join(', ') || 'Cocktail bar';
    const reviewSnippet = business.review_count ? `Popular spot with ${business.review_count} reviews` : 'Great cocktail destination';
    
    return `${categories}. ${reviewSnippet} in ${business.location?.city || 'Los Angeles'}.`;
  }

  private extractYelpFeatures(business: any): string[] {
    const features: string[] = [];
    
    if (business.transactions?.includes('delivery')) features.push('delivery');
    if (business.transactions?.includes('pickup')) features.push('takeout');
    if (business.price === '$$$$') features.push('upscale');
    if (business.rating >= 4.5) features.push('highly rated');
    if (business.review_count >= 100) features.push('popular');
    
    const categories = business.categories || [];
    categories.forEach((cat: any) => {
      const title = cat.title.toLowerCase();
      if (title.includes('speakeasy')) features.push('speakeasy');
      if (title.includes('wine')) features.push('wine bar');
      if (title.includes('cocktail')) features.push('craft cocktails');
    });
    
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

  private generateAtmosphereFromYelp(business: any): string[] {
    const atmosphere: string[] = [];
    const name = business.name.toLowerCase();
    
    if (name.includes('rooftop')) atmosphere.push('rooftop');
    if (name.includes('lounge')) atmosphere.push('upscale', 'sophisticated');
    if (name.includes('speakeasy')) atmosphere.push('intimate', 'vintage');
    if (business.price === '$$$$') atmosphere.push('upscale');
    if (business.price === '$') atmosphere.push('casual');
    
    const categories = business.categories || [];
    categories.forEach((cat: any) => {
      const title = cat.title.toLowerCase();
      if (title.includes('wine')) atmosphere.push('sophisticated');
      if (title.includes('dive')) atmosphere.push('casual');
    });
    
    const defaultAtmospheres = ['intimate', 'upscale', 'casual', 'sophisticated', 'lively'];
    const additionalCount = Math.max(0, 2 - atmosphere.length);
    
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