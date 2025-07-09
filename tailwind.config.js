/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'score-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'leaderboard-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'hole-gradient': 'radial-gradient(circle, #8B4513 0%, #654321 50%, #3E2723 100%)',
        'mole-gradient': 'radial-gradient(circle, #D2691E 0%, #A0522D 50%, #8B4513 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'silver-gradient': 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)',
        'bronze-gradient': 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
        // Gaming1 Asset Backgrounds (using import-based approach)
        // Note: These will be applied via CSS custom properties in components
      },
      animation: {
        'mole-popup': 'molePopup 0.3s ease-out',
        'hammer-swing': 'hammerSwing 0.2s ease-out',
        'blink-eyes': 'blinkEyes 2s infinite',
        'score-glow': 'scoreGlow 1s ease-in-out infinite alternate',
        'pulse-warning': 'pulseWarning 0.5s ease-in-out infinite alternate',
        'critical-pulse': 'criticalPulse 0.3s ease-in-out infinite alternate',
        'status-blink': 'statusBlink 1s ease-in-out infinite',
        'fade-in-scale': 'fadeInScale 0.5s ease-out',
        'current-player-glow': 'currentPlayerGlow 1s ease-in-out infinite alternate',
        'gold-glow': 'goldGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        molePopup: {
          '0%': { transform: 'translateY(100%) scale(0.8)', opacity: '0' },
          '50%': { transform: 'translateY(-10%) scale(1.1)' },
          '100%': { transform: 'translateY(0%) scale(1)', opacity: '1' },
        },
        hammerSwing: {
          '0%': { transform: 'rotate(-45deg) scale(0.8)', opacity: '0' },
          '50%': { transform: 'rotate(0deg) scale(1.2)', opacity: '1' },
          '100%': { transform: 'rotate(15deg) scale(1)', opacity: '0' },
        },
        blinkEyes: {
          '0%, 90%, 100%': { opacity: '1' },
          '95%': { opacity: '0' },
        },
        scoreGlow: {
          '0%': { textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700' },
          '100%': { textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700' },
        },
        pulseWarning: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.7' },
        },
        criticalPulse: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        statusBlink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0.3' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        currentPlayerGlow: {
          '0%': { boxShadow: '0 0 10px #10B981' },
          '100%': { boxShadow: '0 0 20px #10B981, 0 0 30px #10B981' },
        },
        goldGlow: {
          '0%': { boxShadow: '0 5px 20px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 5px 30px rgba(255, 215, 0, 0.6)' },
        },
      },
      // Gaming1 cursors will be applied via inline styles in components
    },
  },
  plugins: [],
}
