/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
    theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      white: 'white',
      black: 'black',
      gray: '#f3f4f6',
      grayD: '#e5e7eb',
      rose: '#dc2626',
      roseD: '#b91c1c',
      roseL: '#ef4444',
    }
  },
  plugins: [],
}

