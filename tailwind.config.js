/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      backgroundImage: {
        'custom-gradient': 'linear-gradient(90.07deg, #EE10B0 -4.82%, rgba(14, 158, 239, 0.92) 127.01%)',
      },

    },
  },
  plugins: [],
}