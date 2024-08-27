import { defineConfig } from 'vite'; // Vite 설정을 정의하기 위해 import
import react from '@vitejs/plugin-react'; // React 플러그인을 사용하기 위해 import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // React 플러그인을 Vite 설정에 추가
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'], // React와 React-DOM을 별도의 chunk로 분리
          'framer-motion': ['framer-motion'], // Framer Motion을 별도의 chunk로 분리
          'date-fns': ['date-fns'], // Date-fns를 별도의 chunk로 분리
          'react-icons': ['react-icons'], // React Icons를 별도의 chunk로 분리
        },
      },
    },
    chunkSizeWarningLimit: 1000, // chunk 크기 경고 한계를 1000으로 설정
  },
});
