// vite.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  test: {
    globals: true, // Permite usar expect, describe, test sem importação
    environment: 'jsdom', // Simula o ambiente DOM do navegador
    setupFiles: './src/setupTests.ts', // Caminho para o seu arquivo de setup
    css: true, 
  }
})