/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    colors:{
      primary:"#DDCCF7",
      secondary:"#000000",
      blue:"#0000F7",
      mark:"#EA040E",
      right:"#31B030",
      white:"#ffff",
      grey :"#E9E9E9",
      buttonDisable:'#CCCCCC'
    },
    fontFamily:{
      poppins:["poppins","serif"],
      novo:['Nova Mono', "monospace"],
      p2:['Press Start 2P', "cursive"] 
    },
    extend: {
      animation: {
        text: 'text 8s ease-in-out infinite',
      },
      keyframes: {
        text: {
          '0%, 100%': {
            "width":"0%" 
          },
          '50%': {
            "width":"100%"
          },
        },
      },
    },
  },
  plugins: [],
}

