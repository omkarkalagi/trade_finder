import { build } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { rmSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildApp() {
  try {
    console.log('🧹 Cleaning previous build...')

    // Force clean the dist directory
    try {
      rmSync(resolve(__dirname, 'dist'), { recursive: true, force: true })
      console.log('✅ Previous build cleaned')
    } catch (err) {
      console.log('ℹ️ No previous build to clean')
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
