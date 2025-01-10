/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      '2xs': '0.50rem',
      '3xs':'0.35rem',
      '1xs':'0.75rem',
    },

    colors:
    {
      'blue':'#5A639C',
      'pink':'#FF8C9E',
      'brown':'#BC9F8B',
      'green':'#597445'

    }

  },
  plugins: [],
}