import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      proxy: env.VITE_API_URL
        ? {}
        : {
            // Only in dev mode when VITE_API_URL isn't set, proxy /api/* to localhost:8000
            '/api': 'http://localhost:8000',
          },
    },
  };
});
