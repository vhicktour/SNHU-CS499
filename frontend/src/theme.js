import { extendTheme } from '@chakra-ui/react';

const fonts = {
  heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji"',
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji"',
};

const colors = {
  brand: {
    50: '#F5F7FA',
    100: '#E4E7EB',
    200: '#CBD2D9',
    300: '#9AA5B1',
    400: '#7B8794',
    500: '#616E7C',
    600: '#52606D',
    700: '#3E4C59',
    800: '#323F4B',
    900: '#1F2933',
  },
  accent: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.900',
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'lg',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'accent.600' : 'accent.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'accent.700' : 'accent.600',
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s',
      }),
    },
  },
  Container: {
    baseStyle: {
      maxW: '7xl',
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
    },
  },
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

export const theme = extendTheme({
  fonts,
  colors,
  components,
  styles,
  config,
});
