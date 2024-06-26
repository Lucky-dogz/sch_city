import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import gltf from 'vite-plugin-gltf';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    gltf({
      transforms: [],
    }),
  ],
  base: './',
  build: {
    minify: 'terser', // 使用 Terser 进行代码压缩混淆
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    // 设置文件./src路径为 @
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
});
