/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        white: "#fff",
        dodgerblue: "#0099ff",
        darkgray: "#aaa",
        steelblue: "#1089d3",
        darkgray: "#3F3F3F",
      },
      spacing: {},
      borderRadius: {
        "21xl": "40px",
        xl: "20px",
      },
    },
    fontSize: {
      "sm-3": "13.3px",
      "2xs": "11px",
      "11xl": "30px",
      lg: "18px",
      "5xl": "24px",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      mq1050: {
        raw: "screen and (max-width: 1050px)",
      },
      mq750: {
        raw: "screen and (max-width: 750px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
