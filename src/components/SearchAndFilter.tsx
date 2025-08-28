import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Typography,
  Grid,
  IconButton,
  Rating,
  Checkbox,
  FormControlLabel,
  Collapse,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  Search,
  FilterList as Filter,
  Star,
  Schedule as Clock,
  AttachMoney as DollarSign,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { glassmorphismStyle } from '../theme/nightlifeTheme';
import type { FilterOptions } from '../types';
import { cocktailTypes, atmosphereOptions } from '../data/sampleData';

interface SearchAndFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  const handlePriceRangeChange = (range: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: range
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating
    });
  };

  const handleCocktailTypeToggle = (cocktailType: string) => {
    const newTypes = filters.cocktailTypes.includes(cocktailType)
      ? filters.cocktailTypes.filter(t => t !== cocktailType)
      : [...filters.cocktailTypes, cocktailType];
    
    onFiltersChange({
      ...filters,
      cocktailTypes: newTypes
    });
  };

  const handleAtmosphereToggle = (atmosphere: string) => {
    const newAtmosphere = filters.atmosphere.includes(atmosphere)
      ? filters.atmosphere.filter(a => a !== atmosphere)
      : [...filters.atmosphere, atmosphere];
    
    onFiltersChange({
      ...filters,
      atmosphere: newAtmosphere
    });
  };

  const handleOpenNowToggle = () => {
    onFiltersChange({
      ...filters,
      isOpen: !filters.isOpen
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      priceRange: [1, 4],
      rating: 0,
      cocktailTypes: [],
      atmosphere: [],
      isOpen: false,
      location: null
    });
  };

  const getPriceDisplay = (value: number) => '$'.repeat(value);

  return (
    <Card sx={{ ...glassmorphismStyle, mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 Search bars, neighborhoods, or cocktails..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '1.1rem',
              },
            }}
          />
          
          <Button
            variant={showFilters ? "contained" : "outlined"}
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<Filter />}
            endIcon={showFilters && <Box sx={{ width: 8, height: 8, bgcolor: 'white', borderRadius: '50%', animation: 'pulse 2s infinite' }} />}
            sx={{
              minWidth: 140,
              py: 1.5,
              px: 3,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            ✨ Filters
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Filters
              </Typography>
              <Button
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                Clear all
              </Button>
            </Box>

            <Grid container spacing={3}>
              {/* Price Range */}
              <Grid item xs={12} md={6} lg={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 'bold' }}>
                    <DollarSign sx={{ fontSize: 16 }} />
                    Price Range
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4].map((price) => (
                      <Chip
                        key={price}
                        label={getPriceDisplay(price)}
                        variant={filters.priceRange.includes(price) ? "filled" : "outlined"}
                        color={filters.priceRange.includes(price) ? "primary" : "default"}
                        onClick={() => {
                          const newRange = filters.priceRange.includes(price)
                            ? filters.priceRange.filter(p => p !== price)
                            : [...filters.priceRange, price];
                          handlePriceRangeChange(newRange);
                        }}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Rating */}
              <Grid item xs={12} md={6} lg={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 'bold' }}>
                    <Star sx={{ fontSize: 16 }} />
                    Minimum Rating
                  </Typography>
                  <Rating
                    value={filters.rating}
                    onChange={(_, newValue) => handleRatingChange(newValue || 0)}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#ffd700',
                      },
                      '& .MuiRating-iconEmpty': {
                        color: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Open Now */}
              <Grid item xs={12} md={6} lg={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 'bold' }}>
                    <Clock sx={{ fontSize: 16 }} />
                    Availability
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.isOpen}
                        onChange={handleOpenNowToggle}
                        sx={{
                          color: 'primary.main',
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    }
                    label="Open now"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Cocktail Types */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                🍸 Cocktail Types
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cocktailTypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    variant={filters.cocktailTypes.includes(type) ? "filled" : "outlined"}
                    color={filters.cocktailTypes.includes(type) ? "primary" : "default"}
                    onClick={() => handleCocktailTypeToggle(type)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Atmosphere */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                🎭 Atmosphere
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {atmosphereOptions.map((atmosphere) => (
                  <Chip
                    key={atmosphere}
                    label={atmosphere}
                    variant={filters.atmosphere.includes(atmosphere) ? "filled" : "outlined"}
                    color={filters.atmosphere.includes(atmosphere) ? "secondary" : "default"}
                    onClick={() => handleAtmosphereToggle(atmosphere)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;