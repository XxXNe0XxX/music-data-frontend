/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Add your font family
        ubuntu: ["Ubuntu", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        lexend: ["Lexend Deca", "sans-serif"],
      },
    },
  },
  plugins: [],
};
