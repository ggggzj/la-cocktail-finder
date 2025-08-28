import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Rating,
  Avatar,
  Divider,
  Button,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Phone,
  Language as Globe,
  LocationOn as MapPin,
  Star,
  Schedule as Clock,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { glassmorphismStyle } from '../theme/nightlifeTheme';
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
      <Card sx={{ ...glassmorphismStyle, textAlign: 'center', p: 6 }}>
        <Avatar
          sx={{
            width: 96,
            height: 96,
            mx: 'auto',
            mb: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
          }}
        >
          <MapPin sx={{ fontSize: 40, color: 'text.secondary' }} />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          No bars found
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 400, mx: 'auto' }}>
          We couldn't find any cocktail bars matching your criteria. Try adjusting your filters or search terms to discover new places.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {['🍸', '🍹', '🥃'].map((emoji, index) => (
            <Typography key={index} variant="h2" sx={{ fontSize: '3rem' }}>
              {emoji}
            </Typography>
          ))}
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {bars.map((bar, index) => (
        <Zoom in key={bar.id} style={{ transitionDelay: `${index * 100}ms` }}>
          <Card
            onClick={() => onBarSelect(bar)}
            sx={{
              ...glassmorphismStyle,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'visible',
              border: selectedBar?.id === bar.id ? 2 : 1,
              borderColor: selectedBar?.id === bar.id ? 'primary.main' : 'rgba(233, 30, 99, 0.2)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(233, 30, 99, 0.3)',
                '& .bar-name': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      variant="h6"
                      className="bar-name"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {bar.name}
                    </Typography>
                    <Chip
                      label={isOpenNow(bar.openHours) ? 'OPEN NOW' : 'CLOSED'}
                      size="small"
                      color={isOpenNow(bar.openHours) ? 'success' : 'error'}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        animation: isOpenNow(bar.openHours) ? 'pulse 2s infinite' : 'none',
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating
                        value={1}
                        max={1}
                        readOnly
                        size="small"
                        sx={{ '& .MuiRating-iconFilled': { color: '#ffd700' } }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {bar.rating}
                      </Typography>
                    </Box>

                    <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />

                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {formatPriceRange(bar.priceRange)}
                    </Typography>

                    <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatHours(bar.openHours)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
                    <MapPin sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                      {bar.address}
                    </Typography>
                  </Box>
                </Box>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(bar.id);
                  }}
                  sx={{
                    ml: 2,
                    color: favoriteIds.includes(bar.id) ? 'error.main' : 'text.secondary',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      color: 'error.main',
                    },
                  }}
                >
                  {favoriteIds.includes(bar.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <Divider sx={{ my: 2, opacity: 0.3 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                  🍸 Signature Cocktails
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {bar.cocktailTypes.slice(0, 3).map((cocktail, index) => (
                    <Chip
                      key={index}
                      label={cocktail.name}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      }}
                    />
                  ))}
                  {bar.cocktailTypes.length > 3 && (
                    <Chip
                      label={`+${bar.cocktailTypes.length - 3} more`}
                      size="small"
                      variant="filled"
                      color="primary"
                      sx={{ fontSize: '0.75rem', opacity: 0.7 }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'secondary.main' }}>
                  🎭 Atmosphere
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {bar.atmosphere.slice(0, 2).map((mood, index) => (
                    <Chip
                      key={index}
                      label={mood}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>

              {bar.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    mb: 2,
                  }}
                >
                  "{bar.description}"
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                {bar.phone && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Phone sx={{ fontSize: 16 }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${bar.phone}`, '_blank');
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Call
                  </Button>
                )}
                {bar.website && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Globe sx={{ fontSize: 16 }} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(bar.website, '_blank');
                    }}
                    sx={{
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Website
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      ))}
    </Box>
  );
};

export default BarList;