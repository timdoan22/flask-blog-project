/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./public/**/*.{html,js}",
      "./views/*.ejs",
      "./node_modules/tw-element/dist/js/**/*.min.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}