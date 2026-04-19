/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'flip': 'flip 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};
