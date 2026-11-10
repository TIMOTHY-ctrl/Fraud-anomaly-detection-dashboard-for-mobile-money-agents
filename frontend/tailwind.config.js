/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2864dc",
          600: "#0869c7",
          700: "#0756a4",
          900: "#14243b",
        },
      },
      boxShadow: {
        panel: "0 2px 8px rgb(28 49 80 / 4%)",
      },
    },
  },
  plugins: [],
};
