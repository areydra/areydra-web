import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary': '#FFFFFF',
        'secondary': '#EBEBF5',
      },
      lineHeight: {
        '64': '4rem',
      },
      width: {
        '464': '29rem',
      },
      screens: {
        'xs': '320px'
      }
    },
  },
  plugins: [],
};
export default config;
