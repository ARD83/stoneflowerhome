
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
        sunset: "#fd5e53",
        deep_lagoon: "#3E5F5C",
        coastal_teal: "#729A94",
        golden_mirage: "#D1A679",
        sunkissed_sand: "#E6D5C3",
        luminous_perl: "#F7F3EC"
      }
    }
  },
  plugins: []
}
