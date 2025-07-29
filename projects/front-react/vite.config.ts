import {ConfigEnv, defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const entries = {
  manager: path.resolve(__dirname, 'src/pages/manager/main.tsx'),
  monitor: path.resolve(__dirname, 'src/pages/monitor/main.tsx'), // 新增入口
}

const outputDir = path.resolve(__dirname, '../http-trick/site/manager')



// https://vite.dev/config/
export default defineConfig((env: ConfigEnv) => {
  const isDev = env.mode !== 'production'

  return {
    plugins: [
      react(),
     ].filter(Boolean), // 过滤可能的 undefined 值
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      emptyOutDir: true,
      minify: false,
      sourcemap: isDev,
      outDir: outputDir,
      rollupOptions: {
        input: entries,
        output: {
          format: 'es',
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
          manualChunks: function manualChunks(id: string) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            return null;
          },
        },
        plugins: [

        ].filter(Boolean) // 过滤可能的 undefined 值
      }
    }
  }
})
