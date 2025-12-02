import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
          light: "var(--color-accent-light)",
        },
        neutral: {
          heading: "var(--color-neutral-heading)",
          body: "var(--color-neutral-body)",
          muted: "var(--color-neutral-muted)",
          border: "var(--color-neutral-border)",
        },
        background: {
          DEFAULT: "var(--color-background)",
          alt: "var(--color-background-alt)",
        },
      },
    },
  },
  plugins: [],
};

export default config;

