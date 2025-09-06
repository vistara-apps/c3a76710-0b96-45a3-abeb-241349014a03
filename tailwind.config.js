/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(220, 30%, 98%)',
        foreground: 'hsl(220, 20%, 15%)',
        accent: 'hsl(260, 96%, 60%)',
        primary: 'hsl(220, 96%, 40%)',
        surface: 'hsl(220, 30%, 95%)',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        lg: '16px',
        md: '8px',
        sm: '4px',
      },
      boxShadow: {
        lift: '0 2px 8px hsla(0, 0%, 0%, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
