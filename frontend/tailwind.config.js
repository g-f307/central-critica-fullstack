/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg-primary': '#0f172a',
        'dark-bg-secondary': '#1e293b',
        'dark-text-primary': '#f8fafc',
        'dark-text-secondary': '#cbd5e1',
        'dark-text-muted': '#94a3b8',
        'dark-cyan': '#22d3ee',
        'dark-cyan-hover': '#06b6d4',
        'dark-card': '#1e293b',
        'dark-border': '#334155',
        'light-purple-primary': '#6b21a8',
        'light-blue-primary': '#2563eb',
        'light-text-primary': '#1f2937',
        'light-text-secondary': '#6b7280',
      }
    },
  },
  // O safelist para classes do Quill geralmente não é necessário se quill.snow.css for importado globalmente.
  // Mas se ainda houver problemas com estilos do Quill não aparecendo, você pode adicionar aqui:
  // safelist: [
  //   'ql-align-center',
  //   'ql-align-right',
  //   'ql-align-justify',
  //   { pattern: /ql-(bg|color)-[a-zA-Z]+/ },
  //   { pattern: /ql-indent-\d+/ },
  //   // ... outras classes do Quill ...
  // ],
  plugins: [
    require('@tailwindcss/typography'), // Plugin para classes 'prose'
    require('@tailwindcss/aspect-ratio'), // Se você o instalou para o trailer
  ],
}