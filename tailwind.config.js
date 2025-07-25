
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ['"Lobster"', 'sans-serif'],    // 🏷 Titles
        body: ['"Roboto"', 'serif'],       // 📄 Body text
      },
      colors: {
        sand: "#F1E5D1",
        sea: "#879D91",
        olive: "#A3B18A",
        coral: "#D9825B",
        sunset: "#fd5e53"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
