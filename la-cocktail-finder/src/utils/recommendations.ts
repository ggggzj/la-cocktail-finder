import type { CocktailBar, UserPreferences } from '../types';

export interface RecommendationScore {
  bar: CocktailBar;
  score: number;
  reasons: string[];
}

export const calculateRecommendationScore = (
  bar: CocktailBar, 
  userPreferences: UserPreferences,
  userFavorites: string[],
  trendingBars?: string[]
): RecommendationScore => {
  let score = 0;
  const reasons: string[] = [];
  
  // Base score from rating
  score += bar.rating * 10;
  
  // Cocktail type preferences
  const matchingCocktailTypes = bar.cocktailTypes.filter(ct => 
    userPreferences.favoriteTypes.includes(ct.name)
  );
  
  if (matchingCocktailTypes.length > 0) {
    score += matchingCocktailTypes.length * 15;
    reasons.push(`Serves your favorite cocktails: ${matchingCocktailTypes.map(ct => ct.name).join(', ')}`);
  }
  
  // Price preference
  if (userPreferences.pricePreference.includes(bar.priceRange)) {
    score += 20;
    reasons.push('Matches your price preference');
  }
  
  // Atmosphere preference
  const matchingAtmosphere = bar.atmosphere.filter(atmosphere =>
    userPreferences.atmospherePreference.includes(atmosphere)
  );
  
  if (matchingAtmosphere.length > 0) {
    score += matchingAtmosphere.length * 10;
    reasons.push(`Perfect atmosphere: ${matchingAtmosphere.join(', ')}`);
  }
  
  // Trending bonus
  if (trendingBars?.includes(bar.id)) {
    score += 25;
    reasons.push('Currently trending in LA');
  }
  
  // Already visited penalty (to encourage discovery)
  if (userFavorites.includes(bar.id)) {
    score -= 10;
    reasons.push('Already in your favorites');
  }
  
  // High-rated bonus
  if (bar.rating >= 4.5) {
    score += 15;
    reasons.push('Highly rated by users');
  }
  
  // Variety bonus (bars with diverse cocktail types)
  if (bar.cocktailTypes.length >= 4) {
    score += 10;
    reasons.push('Great cocktail variety');
  }
  
  return {
    bar,
    score: Math.max(0, score),
    reasons
  };
};

export const getRecommendations = (
  bars: CocktailBar[],
  userPreferences: UserPreferences,
  userFavorites: string[],
  limit: number = 5
): RecommendationScore[] => {
  // Simulate trending bars (in a real app, this would come from analytics)
  const trendingBars = bars
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map(bar => bar.id);
  
  const recommendations = bars
    .map(bar => calculateRecommendationScore(bar, userPreferences, userFavorites, trendingBars))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return recommendations;
};

export const getTrendingBars = (bars: CocktailBar[], limit: number = 3): CocktailBar[] => {
  // Simulate trending based on rating and review count
  return bars
    .sort((a, b) => {
      const scoreA = a.rating * a.reviews.length;
      const scoreB = b.rating * b.reviews.length;
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

export const getSimilarBars = (
  selectedBar: CocktailBar,
  allBars: CocktailBar[],
  limit: number = 3
): CocktailBar[] => {
  const similarities = allBars
    .filter(bar => bar.id !== selectedBar.id)
    .map(bar => {
      let similarity = 0;
      
      // Similar cocktail types
      const sharedCocktails = bar.cocktailTypes.filter(ct =>
        selectedBar.cocktailTypes.some(sct => sct.name === ct.name)
      );
      similarity += sharedCocktails.length * 2;
      
      // Similar atmosphere
      const sharedAtmosphere = bar.atmosphere.filter(atmosphere =>
        selectedBar.atmosphere.includes(atmosphere)
      );
      similarity += sharedAtmosphere.length * 3;
      
      // Similar price range
      if (Math.abs(bar.priceRange - selectedBar.priceRange) <= 1) {
        similarity += 5;
      }
      
      // Similar rating
      if (Math.abs(bar.rating - selectedBar.rating) <= 0.5) {
        similarity += 3;
      }
      
      return { bar, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.bar);
  
  return similarities;
};

export const getDefaultUserPreferences = (): UserPreferences => ({
  favoriteTypes: ['whiskey', 'gin'],
  pricePreference: [2, 3],
  atmospherePreference: ['upscale', 'intimate'],
  savedBars: []
});