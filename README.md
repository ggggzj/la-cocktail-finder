# LA Cocktail Finder

A modern web application for discovering the best cocktail bars in Los Angeles. Built with React, TypeScript, and Tailwind CSS.

## Features

🗺️ **Interactive Map** - View cocktail bars on a detailed map with custom markers  
🔍 **Advanced Search & Filtering** - Filter by price, rating, cocktail types, atmosphere, and open hours  
⭐ **Personalized Recommendations** - Get recommendations based on your preferences and trending bars  
❤️ **Favorites System** - Save your favorite bars for easy access  
📱 **Responsive Design** - Optimized for desktop and mobile devices  
🕒 **Real-time Hours** - See which bars are currently open  

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Maps**: React-Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd la-cocktail-finder
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features Overview

### Search and Filtering
- **Text Search**: Search by bar name, address, or cocktail types
- **Price Range**: Filter by price level ($-$$$$)
- **Rating**: Filter by minimum rating
- **Cocktail Types**: Filter by specific spirits (whiskey, gin, rum, etc.)
- **Atmosphere**: Filter by mood and setting (intimate, upscale, casual, etc.)
- **Open Now**: Show only bars currently open

### Map Integration
- Interactive map centered on Los Angeles
- Custom markers for each cocktail bar
- Click markers to view bar details
- Map automatically focuses on selected bars
- Popup cards with essential bar information

### Recommendation System
- **Trending**: Popular bars based on ratings and reviews
- **For You**: Personalized recommendations based on user preferences
- Recommendation scoring considers:
  - User's favorite cocktail types
  - Price preferences
  - Atmosphere preferences
  - Bar ratings and popularity

### User Interactions
- ⭐ Heart/favorite bars for quick access
- 📞 Direct calling from bar listings
- 🌐 Quick access to bar websites
- 🗺️ Map integration for location viewing

## Data Structure

The application uses a comprehensive data model for cocktail bars including:
- Basic information (name, address, coordinates)
- Ratings and price ranges
- Opening hours for each day
- Cocktail specialties and atmosphere tags
- User reviews and ratings
- Contact information and websites

## Sample Data

The app comes pre-loaded with 5 popular LA cocktail bars:
- The Varnish (Downtown speakeasy)
- Broken Shaker (Tropical poolside bar)
- Death & Co (Award-winning cocktail lounge)
- Black Rabbit Rose (Magic-themed bar)
- Harvard & Stone (Vintage-style lounge)

## Integrating Real APIs

To make this application production-ready with real data, consider integrating these APIs:

### Recommended APIs for Bar/Restaurant Data:
- **Google Places API** - For comprehensive business information, ratings, and photos
- **Yelp Fusion API** - For reviews, ratings, and business details
- **Foursquare Places API** - For venue information and user tips
- **Mapbox API** - Alternative to OpenStreetMap with more styling options

### API Integration Steps:
1. **Replace Sample Data**: Update `src/data/sampleData.ts` with API calls
2. **Add API Keys**: Create a `.env` file for API credentials
3. **Implement Data Fetching**: Add services in `src/services/` for API calls
4. **Update Types**: Modify `src/types/index.ts` to match API response schemas
5. **Add Loading States**: Implement loading and error handling in components

### Example API Service Structure:
```typescript
// src/services/placesApi.ts
export const fetchBarsNearLocation = async (lat: number, lng: number) => {
  // Implement Google Places API call
};

export const getBarDetails = async (placeId: string) => {
  // Fetch detailed information
};
```

### Environment Variables:
```bash
# .env
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
VITE_YELP_API_KEY=your_yelp_key_here
```

## Future Enhancements

- User authentication and personalized profiles
- Review and rating system
- Social features (sharing favorite bars)
- Advanced location-based recommendations
- Bar event listings and reservations
- Photo galleries for each bar
- Real-time crowd levels and wait times

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
