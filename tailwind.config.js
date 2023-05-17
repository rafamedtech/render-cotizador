/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          lg: '1124px',
          xl: '1124px',
          '2xl': '1124px',
        },
      },
      boxShadow: {
        pinterest: 'rgb(0 0 0 / 10%) 0px 5px 20px 0px',
      },
      colors: {
        // primary: '#CD104D',
        // primary: '#9ca3af',
        primary: '#EF477A',
        secondary: '#7F2E84',
        accent: '#5C4FA1',
        light: {
          primary: '#EF477A',
          strong: '#cacaca',
          medium: '#f2f2f2',
        },
        dark: {
          primary: '#EE798A',
          strong: '#181818',
          medium: '#222222',
        },
        // primary: "#608AF1",
      },
    },
  },

  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },

  plugins: [require('@tailwindcss/forms'), require('daisyui')],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#EF477A',
          // primary: '#ee798a',
          secondary: '#ef477a',
          // primary: '#9ca3af',
          neutral: '#181818',
        },
      },
      // 'light',
    ],
  },
};
