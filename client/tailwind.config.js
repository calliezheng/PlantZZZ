/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        'amatic': ['Amatic SC', 'cursive'],  
        'opensans': ['Open Sans', 'sans-serif'], 
        'poetsen': ['Poetsen One', 'cursive']
      }
    },
  },
  plugins: [],
}

