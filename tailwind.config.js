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
      black: '#4b5563',
      gray: '#f3f4f6',
      grayD: '#e5e7eb',
      grayD2: '#b3b7c0',
      rose: '#dc2626',
      roseD: '#b91c1c',
      roseL: '#ef4444',
    }
  },
  plugins: [],
}

