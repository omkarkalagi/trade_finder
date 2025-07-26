module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
      colors: {
        primary: '#405DE6',
        secondary: '#833AB4',
        accent: '#FD1D1D',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #405DE6, #833AB4, #FD1D1D)',
      },
    },
  },
  plugins: [],
} 