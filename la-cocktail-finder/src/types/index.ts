export interface CocktailBar {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  priceRange: 1 | 2 | 3 | 4;
  phoneNumber?: string;
  website?: string;
  description?: string;
  imageUrl?: string;
  openHours: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  features: string[];
  cocktailTypes: CocktailType[];
  atmosphere: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface CocktailType {
  name: string;
  popularity: number;
}

export interface FilterOptions {
  search: string;
  priceRange: number[];
  rating: number;
  cocktailTypes: string[];
  atmosphere: string[];
  isOpen: boolean;
  location: {
    lat: number;
    lng: number;
    radius: number;
  } | null;
}

export interface UserPreferences {
  favoriteTypes: string[];
  pricePreference: number[];
  atmospherePreference: string[];
  savedBars: string[];
}