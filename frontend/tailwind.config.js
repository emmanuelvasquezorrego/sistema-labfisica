/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vino: {
          DEFAULT: "#6e1e24",
          dark: "#4a1216",
          light: "#a23b41",
        },
      },
    },
  },
  plugins: [],
}