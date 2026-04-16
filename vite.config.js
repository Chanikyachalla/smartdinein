import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Safely remove trailing slashes from the URL (e.g. "https://domain.com/" -> "https://domain.com")
  const cleanApiUrl = env.API_URL ? env.API_URL.replace(/\/+$/, '') : '';

  return {
    plugins: [react()],
    define: {
      'process.env.API_URL': JSON.stringify(cleanApiUrl)
    }
  }
})
