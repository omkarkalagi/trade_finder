import { build } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { rmSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildApp() {
  try {
    console.log('🧹 Aggressively cleaning ALL caches and builds...')

    // Force clean multiple directories
    const dirsToClean = ['dist', 'build', 'node_modules/.cache', 'node_modules/.vite']
    for (const dir of dirsToClean) {
      try {
        rmSync(resolve(__dirname, dir), { recursive: true, force: true })
        console.log(`✅ Cleaned ${dir}`)
      } catch (err) {
        console.log(`ℹ️ No ${dir} to clean`)
      }
    }

    console.log('🔨 Starting fresh Vite build...')

    await build({
      root: __dirname,
      configFile: resolve(__dirname, 'vite.config.js'),
      logLevel: 'info',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      }
    })

    console.log('✅ Fresh build completed successfully!')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

buildApp()
