/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#12a1a3",
        secondary: "#E3A23D",
        tertiary: "#6D6E71",
        lightTertiary: "#f9fafb",
        borderTertiary: "#d1d5db",
        secondaryLight: "#f8f8f8",
        secondaryDark: "#1d232e",
      },
    },
  },
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("@tailwindcss/forms"),
  ],
};
