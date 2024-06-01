import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['"Space Mono"', 'monospace', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        orange: {
          100: '#ffefe6',
          200: '#ffd8c2',
          300: '#ffb991',
          400: '#ff985e',
          500: '#ff792e',
          600: '#ff5c00',
          700: '#d94e00',
          800: '#b54100',
          900: '#913400',
          950: '#732900',
        },
        gray: {
          100: '#eaeaea',
          200: '#cccccc',
          300: '#a4a4a4',
          400: '#797979',
          500: '#515151',
          600: '#2b2b2b',
          700: '#252525',
          800: '#1f1f1f',
          900: '#131313',
          950: '#0f0f0f',
        },
        // primary: '#ff5c00',
        // onPrimary: '#000000',
        // secondary: '#0f0f0f',
        // onSecondary: '#eaeaea',
        // tertiary: '',
        // error: '',
        // outline: '#2b2b2b',
      },
      screens: {
        xl: '1440px',
      },
      fontFamily: {
        roboto: ['"Roboto Mono"', 'monospace', ...defaultTheme.fontFamily.sans],
      },
    },
    backgroundImage: {
      mountain: "url('/images/mountain.png')",
      aboutUs1: "url('/images/about-us-1.png')",
      aboutUs2: "url('/images/about-us-2.png')",
    },
  },
  plugins: [],
};
