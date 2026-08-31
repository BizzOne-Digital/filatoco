/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand-approved "Earthy Vibes" palette (client-confirmed via Instagram, see conversation).
        cream: '#F8F4EC',
        beige: '#E7E5D9',
        terracotta: '#AE887B',
        sage: '#C3C1AB',
        brown: '#5E5946',
        taupe: '#D9BFB1',
        blush: '#F0DED0',
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
