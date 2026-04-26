/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paper-Texture Minimalist Mid-Century Modern / Organic Boho Palette
        cream: '#E8DED1',
        pink: '#DBA39E',
        green: '#A1B082',
        slate: '#3C415C',
        beige: '#F1E3D3',
        
        // Light mode surfaces
        surface: {
          DEFAULT: '#E8DED1',
          secondary: '#F1E3D3',
          tertiary: '#E0D5C7',
          border: 'rgba(60, 65, 92, 0.12)',
        },
        
        // Primary semantic colors
        primary: {
          pink: '#DBA39E',
          green: '#A1B082',
        },
        
        // Accent
        accent: {
          slate: '#3C415C',
          cream: '#E8DED1',
        },
      },
      fontFamily: {
        // Updated typography - Bricolage Grotesque for headings, Plus Jakarta Sans for body
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Bricolage Grotesque', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Bricolage Grotesque', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
        'organic': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'blob-morph': 'blob-morph 8s ease-in-out infinite',
      },
      keyframes: {
        'blob-morph': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
