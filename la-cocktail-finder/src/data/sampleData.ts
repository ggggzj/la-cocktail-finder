import type { CocktailBar } from '../types';

export const sampleBars: CocktailBar[] = [
  {
    id: '1',
    name: 'The Varnish',
    address: '118 E 6th St, Los Angeles, CA 90014',
    latitude: 34.0466,
    longitude: -118.2506,
    rating: 4.5,
    priceRange: 3,
    phoneNumber: '(213) 622-9999',
    website: 'https://thevarnishbar.com',
    description: 'Hidden speakeasy-style cocktail bar in downtown LA',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500',
    openHours: {
      monday: { closed: true, open: '', close: '' },
      tuesday: { open: '19:00', close: '02:00' },
      wednesday: { open: '19:00', close: '02:00' },
      thursday: { open: '19:00', close: '02:00' },
      friday: { open: '19:00', close: '02:00' },
      saturday: { open: '19:00', close: '02:00' },
      sunday: { open: '19:00', close: '02:00' }
    },
    features: ['speakeasy', 'craft cocktails', 'intimate setting'],
    cocktailTypes: [
      { name: 'whiskey', popularity: 9 },
      { name: 'gin', popularity: 8 },
      { name: 'rum', popularity: 7 }
    ],
    atmosphere: ['intimate', 'upscale', 'dimly lit'],
    reviews: [
      {
        id: 'r1',
        userName: 'Sarah M.',
        rating: 5,
        comment: 'Amazing craft cocktails and intimate atmosphere. Perfect for date night!',
        date: '2024-01-15',
        helpful: 12
      }
    ]
  },
  {
    id: '2',
    name: 'Broken Shaker',
    address: '1760 N Vermont Ave, Los Angeles, CA 90027',
    latitude: 34.1026,
    longitude: -118.2912,
    rating: 4.3,
    priceRange: 2,
    phoneNumber: '(323) 452-0040',
    description: 'Tropical-inspired cocktails in a poolside setting',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=500',
    openHours: {
      monday: { open: '18:00', close: '24:00' },
      tuesday: { open: '18:00', close: '24:00' },
      wednesday: { open: '18:00', close: '24:00' },
      thursday: { open: '18:00', close: '01:00' },
      friday: { open: '18:00', close: '02:00' },
      saturday: { open: '18:00', close: '02:00' },
      sunday: { open: '18:00', close: '24:00' }
    },
    features: ['outdoor seating', 'tropical cocktails', 'poolside'],
    cocktailTypes: [
      { name: 'rum', popularity: 9 },
      { name: 'tequila', popularity: 8 },
      { name: 'mezcal', popularity: 7 }
    ],
    atmosphere: ['casual', 'tropical', 'outdoor'],
    reviews: [
      {
        id: 'r2',
        userName: 'Mike R.',
        rating: 4,
        comment: 'Great tropical vibes and creative cocktails. Can get crowded on weekends.',
        date: '2024-01-20',
        helpful: 8
      }
    ]
  },
  {
    id: '3',
    name: 'Death & Co',
    address: '1681 N Highland Ave, Los Angeles, CA 90028',
    latitude: 34.1042,
    longitude: -118.3389,
    rating: 4.7,
    priceRange: 4,
    phoneNumber: '(323) 666-6699',
    website: 'https://deathandcompany.com',
    description: 'Award-winning cocktail lounge with innovative drinks',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500',
    openHours: {
      monday: { closed: true, open: '', close: '' },
      tuesday: { open: '18:00', close: '01:00' },
      wednesday: { open: '18:00', close: '01:00' },
      thursday: { open: '18:00', close: '02:00' },
      friday: { open: '18:00', close: '02:00' },
      saturday: { open: '18:00', close: '02:00' },
      sunday: { open: '18:00', close: '01:00' }
    },
    features: ['award-winning', 'innovative cocktails', 'upscale'],
    cocktailTypes: [
      { name: 'whiskey', popularity: 9 },
      { name: 'gin', popularity: 8 },
      { name: 'brandy', popularity: 7 },
      { name: 'mezcal', popularity: 8 }
    ],
    atmosphere: ['upscale', 'sophisticated', 'moody'],
    reviews: [
      {
        id: 'r3',
        userName: 'Jennifer L.',
        rating: 5,
        comment: 'Exceptional cocktails and knowledgeable bartenders. Worth every penny!',
        date: '2024-01-25',
        helpful: 15
      }
    ]
  },
  {
    id: '4',
    name: 'Black Rabbit Rose',
    address: '1719 N Hudson Ave, Los Angeles, CA 90028',
    latitude: 34.1039,
    longitude: -118.3396,
    rating: 4.2,
    priceRange: 3,
    phoneNumber: '(323) 469-2669',
    description: 'Magic-themed cocktail bar with live performances',
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500',
    openHours: {
      monday: { closed: true, open: '', close: '' },
      tuesday: { closed: true, open: '', close: '' },
      wednesday: { open: '20:00', close: '02:00' },
      thursday: { open: '20:00', close: '02:00' },
      friday: { open: '20:00', close: '02:00' },
      saturday: { open: '20:00', close: '02:00' },
      sunday: { open: '20:00', close: '02:00' }
    },
    features: ['live entertainment', 'magic shows', 'unique theme'],
    cocktailTypes: [
      { name: 'gin', popularity: 8 },
      { name: 'vodka', popularity: 7 },
      { name: 'rum', popularity: 6 }
    ],
    atmosphere: ['theatrical', 'unique', 'entertaining'],
    reviews: [
      {
        id: 'r4',
        userName: 'David K.',
        rating: 4,
        comment: 'Unique experience with great cocktails and magic shows. Very entertaining!',
        date: '2024-02-01',
        helpful: 10
      }
    ]
  },
  {
    id: '5',
    name: 'Harvard & Stone',
    address: '5221 Hollywood Blvd, Los Angeles, CA 90027',
    latitude: 34.1022,
    longitude: -118.3067,
    rating: 4.1,
    priceRange: 2,
    phoneNumber: '(323) 466-6063',
    description: 'Vintage-style cocktail lounge with live music',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500',
    openHours: {
      monday: { open: '18:00', close: '02:00' },
      tuesday: { open: '18:00', close: '02:00' },
      wednesday: { open: '18:00', close: '02:00' },
      thursday: { open: '18:00', close: '02:00' },
      friday: { open: '18:00', close: '02:00' },
      saturday: { open: '18:00', close: '02:00' },
      sunday: { open: '18:00', close: '02:00' }
    },
    features: ['live music', 'vintage decor', 'dancing'],
    cocktailTypes: [
      { name: 'whiskey', popularity: 8 },
      { name: 'vodka', popularity: 7 },
      { name: 'gin', popularity: 6 }
    ],
    atmosphere: ['vintage', 'lively', 'musical'],
    reviews: [
      {
        id: 'r5',
        userName: 'Lisa P.',
        rating: 4,
        comment: 'Great vintage atmosphere and live music. Perfect for a fun night out!',
        date: '2024-02-05',
        helpful: 7
      }
    ]
  }
];

export const cocktailTypes = [
  'whiskey', 'gin', 'vodka', 'rum', 'tequila', 'mezcal', 'brandy', 'bourbon'
];

export const atmosphereOptions = [
  'intimate', 'upscale', 'casual', 'tropical', 'vintage', 'sophisticated', 
  'moody', 'lively', 'theatrical', 'outdoor', 'speakeasy'
];