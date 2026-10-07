import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#006a4e", dark: "#004d38", light: "#e6f4ef" },
        accent: { DEFAULT: "#f42a41" },
      },
    },
  },
  plugins: [],
};
export default config;
