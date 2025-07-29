/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      tailwindConfig: './tailwind.config.js'
    },
    autoprefixer: {},
  }
};
