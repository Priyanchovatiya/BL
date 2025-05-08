import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Windsurf primary color: Using a teal color as the primary
const windsurfPrimary = {
  50: '#E6FFFA',
  100: '#B2F5EA',
  200: '#81E6D9',
  300: '#4FD1C5',
  400: '#38B2AC',
  500: '#319795', // Primary
  600: '#2C7A7B',
  700: '#285E61',
  800: '#234E52',
  900: '#1D4044',
};

// Black-based theme configuration
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    windsurf: windsurfPrimary,
    primary: windsurfPrimary,
    // Black-based theme colors
    gray: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'windsurf',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'gray.800',
          borderRadius: 'lg',
          boxShadow: 'lg',
        },
      },
    },
  },
});

export default theme;


