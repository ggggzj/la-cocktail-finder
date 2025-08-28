import { useState, useMemo, useEffect } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Button, 
  Chip, 
  Grid,
  Fade,
  Zoom,
  Slide,
  Avatar,
  IconButton,
  Badge,
} from '@mui/material';
import { 
  LocationOn as MapPin, 
  TrendingUp, 
  Favorite as Heart, 
  Star, 
  AutoAwesome as Sparkles, 
  FlashOn as Zap, 
  LocalBar as Cocktail,
  Close as CloseIcon,
  Menu as MenuIcon,
  NightlifeOutlined,
} from '@mui/icons-material';
import { nightlifeTheme, glassmorphismStyle, neonGlowStyle } from './theme/nightlifeTheme';
import MapView from './components/MapView';
import SearchAndFilter from './components/SearchAndFilter';
import BarList from './components/BarList';
import type { CocktailBar, FilterOptions, UserPreferences } from './types';
import { sampleBars } from './data/sampleData';
import { getRecommendations, getTrendingBars, getDefaultUserPreferences } from './utils/recommendations';
import { CocktailBarService } from './services';

const LA_CENTER: [number, number] = [34.0522, -118.2437];
const cocktailBarService = new CocktailBarService();

function App() {
  const [selectedBar, setSelectedBar] = useState<CocktailBar | null>(null);
  const [showBarList, setShowBarList] = useState(false);
  const [bars, setBars] = useState<CocktailBar[]>(sampleBars);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priceRange: [1, 2, 3, 4],
    rating: 0,
    cocktailTypes: [],
    atmosphere: [],
    isOpen: false,
    location: null
  });
  
  const [userPreferences] = useState<UserPreferences>(getDefaultUserPreferences());
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recommended'>('all');

  // Load bars from API on component mount
  useEffect(() => {
    const loadBars = async () => {
      setLoading(true);
      try {
        const apiBars = await cocktailBarService.fetchBarsNearLocation(
          LA_CENTER[0], 
          LA_CENTER[1], 
          10000 // 10km radius
        );
        setBars(apiBars);
      } catch (error) {
        console.error('Failed to load bars from API:', error);
        // Keep sample bars as fallback
      } finally {
        setLoading(false);
      }
    };

    loadBars();
  }, []);

  const filteredBars = useMemo(() => {
    let filteredBars = bars;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBars = filteredBars.filter(bar => 
        bar.name.toLowerCase().includes(searchLower) ||
        bar.address.toLowerCase().includes(searchLower) ||
        bar.description?.toLowerCase().includes(searchLower) ||
        bar.cocktailTypes.some(ct => ct.name.toLowerCase().includes(searchLower)) ||
        bar.atmosphere.some(a => a.toLowerCase().includes(searchLower))
      );
    }

    if (filters.priceRange.length < 4) {
      filteredBars = filteredBars.filter(bar => filters.priceRange.includes(bar.priceRange));
    }

    if (filters.rating > 0) {
      filteredBars = filteredBars.filter(bar => bar.rating >= filters.rating);
    }

    if (filters.cocktailTypes.length > 0) {
      filteredBars = filteredBars.filter(bar =>
        bar.cocktailTypes.some(ct => filters.cocktailTypes.includes(ct.name))
      );
    }

    if (filters.atmosphere.length > 0) {
      filteredBars = filteredBars.filter(bar =>
        bar.atmosphere.some(a => filters.atmosphere.includes(a))
      );
    }

    if (filters.isOpen) {
      filteredBars = filteredBars.filter(bar => {
        const now = new Date();
        const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        
        const todayHours = bar.openHours[today];
        if (!todayHours || todayHours.closed) return false;
        
        const openTime = parseInt(todayHours.open.replace(':', ''));
        const closeTime = parseInt(todayHours.close.replace(':', ''));
        
        if (closeTime < openTime) {
          return currentTime >= openTime || currentTime <= closeTime;
        }
        
        return currentTime >= openTime && currentTime <= closeTime;
      });
    }

    return filteredBars;
  }, [filters, bars]);

  const displayBars = useMemo(() => {
    switch (activeTab) {
      case 'trending':
        return getTrendingBars(filteredBars, 10);
      case 'recommended':
        const recommendations = getRecommendations(filteredBars, userPreferences, favoriteIds, 10);
        return recommendations.map(r => r.bar);
      default:
        return filteredBars;
    }
  }, [activeTab, filteredBars, userPreferences, favoriteIds]);

  const handleBarSelect = (bar: CocktailBar) => {
    setSelectedBar(bar);
    setShowBarList(true); // Show the bar list when a marker is clicked
  };

  const handleToggleFavorite = (barId: string) => {
    setFavoriteIds(prev => 
      prev.includes(barId) 
        ? prev.filter(id => id !== barId)
        : [...prev, barId]
    );
  };

  return (
    <ThemeProvider theme={nightlifeTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Animated background elements */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(233, 30, 99, 0.1) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 30%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)',
            animation: 'pulse 6s ease-in-out infinite reverse',
            zIndex: 0,
          }}
        />

        {/* Header */}
        <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(233, 30, 99, 0.2)' }}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #e91e63, #9c27b0, #00bcd4)',
                    fontSize: '2rem',
                    transform: 'rotate(12deg)',
                    transition: 'transform 0.3s ease',
                    ...neonGlowStyle,
                    '&:hover': {
                      transform: 'rotate(0deg)',
                    },
                  }}
                >
                  🍸
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    width: 24,
                    height: 24,
                    background: 'linear-gradient(135deg, #00ff88, #00cc70)',
                    borderRadius: '50%',
                    border: '3px solid white',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <Sparkles
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: -8,
                    color: '#ffd700',
                    animation: 'spin 3s linear infinite',
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '3rem' }, lineHeight: 1 }}>
                  LA Cocktail Finder
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  🌟 Discover magical cocktail experiences in Los Angeles ✨
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              {loading && (
                <Slide direction="left" in={loading}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Zap sx={{ color: '#ffd700', animation: 'bounce 1s infinite' }} />
                    <Typography variant="body2">Loading amazing bars...</Typography>
                  </Box>
                </Slide>
              )}
              
              <Paper
                elevation={3}
                sx={{
                  ...glassmorphismStyle,
                  px: 3,
                  py: 1.5,
                  textAlign: 'right',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {displayBars.length} 🍹 bars found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ❤️ {favoriteIds.length} favorite{favoriteIds.length !== 1 ? 's' : ''}
                </Typography>
              </Paper>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          <SearchAndFilter filters={filters} onFiltersChange={setFilters} />

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {showBarList && (
              <Grid item xs={12} lg={5}>
                <Fade in={showBarList}>
                  <Card sx={{ ...glassmorphismStyle, mb: 3 }}>
                    <Box sx={{ p: 1 }}>
                      <Tabs
                        value={activeTab}
                        onChange={(_, newTab) => setActiveTab(newTab)}
                        variant="fullWidth"
                        sx={{
                          '& .MuiTabs-flexContainer': {
                            gap: 1,
                          },
                        }}
                      >
                        <Tab
                          value="all"
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              🎯 All Bars
                              <Chip label={filteredBars.length} size="small" />
                            </Box>
                          }
                        />
                        <Tab
                          value="trending"
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TrendingUp sx={{ fontSize: 18 }} />
                              🔥 Trending
                            </Box>
                          }
                        />
                        <Tab
                          value="recommended"
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Star sx={{ fontSize: 18 }} />
                              ✨ For You
                            </Box>
                          }
                        />
                      </Tabs>
                    </Box>

                    <CardContent>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setShowBarList(false)}
                        startIcon={<CloseIcon />}
                        sx={{ mb: 2 }}
                      >
                        Hide List - Show Map Only
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>

                <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                  <BarList
                    bars={displayBars}
                    selectedBar={selectedBar}
                    onBarSelect={handleBarSelect}
                    onToggleFavorite={handleToggleFavorite}
                    favoriteIds={favoriteIds}
                  />
                </Box>
              </Grid>
            )}

            <Grid item xs={12} lg={showBarList ? 7 : 12}>
              {!showBarList && (
                <Zoom in={!showBarList}>
                  <Card sx={{ ...glassmorphismStyle, mb: 4, textAlign: 'center' }}>
                    <CardContent sx={{ p: 6 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                        {['🍸', '🍹', '🥃', '🍷'].map((emoji, index) => (
                          <Typography
                            key={emoji}
                            variant="h2"
                            sx={{
                              fontSize: '3rem',
                              animation: 'bounce 2s infinite',
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            {emoji}
                          </Typography>
                        ))}
                      </Box>
                      <Typography variant="h3" sx={{ mb: 2 }}>
                        🎯 Click on cocktail markers to explore bars!
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                        ✨ Discover amazing cocktail experiences around Los Angeles
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        {[Cocktail, Sparkles, Zap].map((Icon, index) => (
                          <Icon
                            key={index}
                            sx={{
                              fontSize: 32,
                              color: `hsl(${index * 120 + 300}, 70%, 60%)`,
                              animation: 'pulse 2s infinite',
                              animationDelay: `${index * 0.3}s`,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              )}

              <Card sx={{ ...glassmorphismStyle, height: 700, position: 'relative', overflow: 'hidden' }}>
                <MapView
                  bars={displayBars}
                  selectedBar={selectedBar}
                  onBarSelect={handleBarSelect}
                  center={selectedBar ? [selectedBar.latitude, selectedBar.longitude] : LA_CENTER}
                  zoom={selectedBar ? 16 : 12}
                />

                {/* Map overlay info */}
                {selectedBar && (
                  <Slide direction="down" in={!!selectedBar}>
                    <Paper
                      elevation={6}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        maxWidth: 320,
                        zIndex: 1000,
                        ...glassmorphismStyle,
                        p: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {selectedBar.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedBar(null)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {selectedBar.address}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {selectedBar.rating}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                          {'$'.repeat(selectedBar.priceRange)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Slide>
                )}
              </Card>
            </Grid>
          </Grid>

          {favoriteIds.length > 0 && (
            <Fade in={favoriteIds.length > 0}>
              <Card sx={{ ...glassmorphismStyle, mt: 6 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #e91e63, #9c27b0, #00bcd4)',
                      }}
                    >
                      <Heart sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Your Favorites
                    </Typography>
                    <Chip
                      label={`${favoriteIds.length} place${favoriteIds.length !== 1 ? 's' : ''}`}
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24, #5f27cd)',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    {favoriteIds.map(id => {
                      const bar = sampleBars.find(b => b.id === id);
                      if (!bar) return null;
                      return (
                        <Grid item xs={12} md={6} lg={4} key={id}>
                          <Card
                            onClick={() => handleBarSelect(bar)}
                            sx={{
                              cursor: 'pointer',
                              ...glassmorphismStyle,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(233, 30, 99, 0.3)',
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  {bar.name}
                                </Typography>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    bgcolor: 'error.main',
                                    borderRadius: '50%',
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                {bar.address}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {bar.rating}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  {bar.cocktailTypes.slice(0, 2).map((cocktail, index) => (
                                    <Chip
                                      key={index}
                                      label={cocktail.name}
                                      size="small"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          )}
        </Container>

        {/* Global CSS animations */}
        <Box
          component="style"
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                40%, 43% { transform: translateY(-20px); }
                70% { transform: translateY(-10px); }
                90% { transform: translateY(-4px); }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `,
          }}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
