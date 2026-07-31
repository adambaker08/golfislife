/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        fairway: "#1f4d2c",
        fairwayDark: "#12301b",
        sand: "#e8dcc4",
      },
    },
  },
  plugins: [],
};
