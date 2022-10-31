const colors = require('./src/styles/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    colors,
    extend: {},
  },
  plugins: [],
};
