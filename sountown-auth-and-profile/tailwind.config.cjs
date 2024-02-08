/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        primary: "var(--primary-color)", // provide from style in index.html
        secondary: "#181818",
        black: "#121212",
        danger: "#FF6464",
        dark: "#232323",
        gray: {
          DEFAULT: "#959595"
        }
      },
      screens: {
        "xl": "1378px",
        "2xl": "1640px"
      }
    },
    fontFamily: {
      inter: "Inter, sans-serif"
    }
  },
  plugins: [],
}
