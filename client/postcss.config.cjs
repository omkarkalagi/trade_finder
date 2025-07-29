// Use CommonJS require syntax
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    tailwindcss(),
    autoprefixer()
  ]
};
