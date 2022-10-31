/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: ({ colors }) => ({
        primary: colors.purple,
        secondary: colors.gray,
        success: colors.green,
        error: colors.red,
      }),
    },
  },
  plugins: [],
};
