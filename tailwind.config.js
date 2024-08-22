/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
    container: {
      screens: {
        sm: '500px',
        md: '500px',
        lg: '500px',
        xl: '500px',
        '2xl': '500px',
      },
    },
  },

  plugins: [],
};
