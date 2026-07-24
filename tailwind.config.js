/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141416',
        'ink-deep': '#0B0E14',
        card: '#242a34',
        'card-2': '#181c23',
        'card-3': '#1c212a',
        brand: '#D43C33',
        'brand-bright': '#FF4B4B',
        'brand-deep': '#7A0000',
        muted: '#AEB5C2',
        faint: '#8B929E',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
