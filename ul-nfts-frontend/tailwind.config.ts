import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
        },
        secondary: {
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
        },
        dark: {
          DEFAULT: "#1f2937",
          light: "#374151",
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#6366f1",
          secondary: "#14b8a6",
          accent: "#1FB2A6",
          neutral: "#1f2937",
          "base-100": "#1f2937",
          "base-200": "#374151",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
} satisfies Config;
