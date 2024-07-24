/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: "1rem", // Base padding for all screens
        sm: "2rem", // Padding for small screens
        md: "6rem", // Padding for medium screens
        "2xl": "10rem", // Padding for 2xl screens
      },
      //padding: "10rem",
    },
  },
  plugins: [],
}
