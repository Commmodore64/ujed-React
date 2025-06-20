/** @type {import('tailwindcss').Config} */
import keepPreset from "keep-react/preset";
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "node_modules/keep-react/**/*.{js,jsx,ts,tsx}"],
  presets: [keepPreset],
  theme: {
    extend: {},
  },
  plugins: [],
}

