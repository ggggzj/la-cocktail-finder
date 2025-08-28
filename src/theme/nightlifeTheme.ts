import { createTheme } from '@mui/material/styles';

// LA Nightlife inspired color palette
export const nightlifeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e91e63', // Hot pink - main brand color
      light: '#ff6090',
      dark: '#ad1457',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0', // Purple - complementary nightlife color
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a', // Deep black background
      paper: 'rgba(30, 30, 30, 0.95)', // Semi-transparent dark cards
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #e91e63, #9c27b0, #00bcd4)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none' as const,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
          color: '#ffffff',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #ad1457, #7b1fa2)',
            boxShadow: '0 6px 24px rgba(233, 30, 99, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ad1457, #7b1fa2)',
          },
        },
        outlined: {
          background: 'transparent',
          border: '2px solid #e91e63',
          color: '#e91e63',
          '&:hover': {
            background: 'rgba(233, 30, 99, 0.1)',
            border: '2px solid #ad1457',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(233, 30, 99, 0.2)',
          boxShadow: '0 8px 32px rgba(233, 30, 99, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          border: '1px solid rgba(233, 30, 99, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(233, 30, 99, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(233, 30, 99, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e91e63',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(233, 30, 99, 0.2)',
          color: '#ffffff',
          border: '1px solid rgba(233, 30, 99, 0.3)',
          fontWeight: 500,
          '&:hover': {
            background: 'rgba(233, 30, 99, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.9), rgba(156, 39, 176, 0.9))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 12,
          padding: 4,
        },
        indicator: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 4px',
          fontWeight: 600,
          textTransform: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(233, 30, 99, 0.3)',
          },
        },
      },
    },
  },
});

// Custom component styles
export const glassmorphismStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

export const neonGlowStyle = {
  boxShadow: `
    0 0 20px rgba(233, 30, 99, 0.3),
    0 0 40px rgba(233, 30, 99, 0.2),
    0 0 60px rgba(233, 30, 99, 0.1)
  `,
};