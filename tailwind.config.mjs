/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        		 // Our colors start
            darkColor: "#151515",
            lightColor: "#52525b",
            lightOrange: "#fca99b",
            lightBlue: "#7688DB",
            darkBlue: "#6c7fd8",
            darkText: "#686e7d",
            lightBg: "#F8F8FB",
            // Our colors end
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
    },
  },
  plugins: [],
};
