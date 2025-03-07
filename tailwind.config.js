module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        primary: ['Montserrat'],
        secondary: ['Racing sans one']
      },
      colors: {
        primary: ['#FF4E3C'],
        Secondary: ['#FF9C06'],
        third: ['#031342'],
        forth: ['#070F29'],
        Background: ['#f0f0f0'],
        WhiteBackground: ['#f0f0f0'],
      }
    },
  },
  variants: {
    extend: { animation: ['motion-safe'] },
  },
  plugins: [require('@tailwindcss/forms')],
}
