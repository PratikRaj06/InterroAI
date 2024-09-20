/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors:{
        'white': "#FFFFFF",
        'blue-light': '#EFF6FF',
        'blue-regular': "#4B92FF",
        'blue-medium': "#0856CF",
        'blue-dark': "#142D55",
        "red": "#d1001f",
        "pink": "#D3529E",
        "purple": "#A84BBF",
        "pink-light": "#fae8ff",
      },
    },
  },
  plugins: [],
}