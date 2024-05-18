/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        'amatic': ['Amatic SC', 'cursive'],  
        'opensans': ['Open Sans', 'sans-serif'], 
        'poetsen': ['Poetsen One', 'cursive']
      },

      width: {
        '100': '25rem',  
      },

      backgroundImage: {
        'hero-pattern': "url('http://localhost:3001/images/other/background.jpg')",
      },

      colors: {
        brown: {
          DEFAULT: '#795548', // A sample brown color
          light: '#A98274',  // Lighter shade of brown
          dark: '#4B2C20'   // Darker shade of brown
        },
        beige: '#DFE4E7',
      }
    },
  },
  plugins: [],
}

