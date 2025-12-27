/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // User frontend colors
        primary: '#8B7355', // Warm brown
        accent: '#D4A574', // Light golden brown
        highlight: '#F5E6D3', // Very light cream
        background: '#F7F3EE', // Pure white
        'light-gray': '#F8F6F3', // Warm light gray
        'dark-brown': '#5D4037', // Dark brown from logo
        'warm-white': '#FDFCFA', // Warm white
        'cream': '#F7F3EE', // Cream color
        'light-cream': '#FAF8F5', // Very light cream
        'warm-gray': '#F5F2ED', // Warm gray
        
        // Cafe frontend colors
        secondary: '#10B981',
        danger: '#EF4444',
      },
      fontFamily: {
        'albert': ['Albert Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        typing: {
          '0%': { width: '0ch' },
          '50%': { width: '100%' },
          '100%': { width: '0ch' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#fff' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        typing: 'typing 10s steps(30) infinite',
        blink: 'blink 1s step-end infinite',
        fadeInUp: 'fadeInUp 1s ease-out',
        bounceSlow: 'bounceSlow 3s infinite',
      },
    },
  },
  plugins: [],
}
