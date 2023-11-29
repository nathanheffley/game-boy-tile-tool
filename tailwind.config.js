/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}"
  ],
  theme: {
    extend: {
      colors: {
        lightest: 'rgb(var(--color-lightest) / <alpha-value>)',
        light: 'rgb(var(--color-light) / <alpha-value>)',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        darkest: 'rgb(var(--color-darkest) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

