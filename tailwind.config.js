/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "himbalin-dark": "#2B1A12",
        "himbalin-gold": "#F4A623",
        "himbalin-beige": "#F5F1EC",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
