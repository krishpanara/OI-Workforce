/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#001B5C',
        blue: '#1D5FD4',
        midblue: '#2A7DE1',
        deepteal: '#2C8C8A',
        darkteal: '#267A76',
        'tint-blue': '#EEF4FD',
        'tint-teal': '#E6F4F4',
        'tint-white': '#F7F9FF',
        grey: '#5B6472',
        line: '#E4E9F0',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
