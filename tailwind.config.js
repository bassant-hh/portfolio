/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain:        'var(--bg)',
        bgTerminal:   'var(--terminal)',
        borderSoft:   'var(--border-soft)',
        borderActive: 'var(--border)',
        textPrimary:   'var(--text)',
        textSecondary: 'var(--text-secondary)',
        textAccent:    'var(--primary)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
