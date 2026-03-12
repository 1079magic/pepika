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
        brand: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fad7a5',
          300: '#f6bb6d',
          400: '#f19a3a',
          500: '#ee7d15',
          600: '#df630b',
          700: '#b94a0b',
          800: '#933b10',
          900: '#773310',
          950: '#401706',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c7d7c8',
          300: '#a1bba3',
          400: '#769a79',
          500: '#567c59',
          600: '#436345',
          700: '#375039',
          800: '#2e412f',
          900: '#273628',
          950: '#121d14',
        },
        cream: '#faf8f5',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
