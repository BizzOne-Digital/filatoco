/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F4EC',
        beige: '#E9DED0',
        terracotta: '#B86F4A',
        sage: '#7D8166',
        brown: '#49372F',
        taupe: '#B3A292',
        offwhite: '#FFFDF9',
        ink: '#372C27',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"DM Sans"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(73,55,47,0.08)',
      },
    },
  },
  plugins: [],
};
