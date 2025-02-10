import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          500: "#6B4F30",  // Custom brown color for buttons
          600: "#4B3C23",  // Darker brown for hover effect
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
