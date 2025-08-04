import { spawn } from 'child_process'
import { existsSync } from 'fs'

async function runBuild() {
  console.log('🔧 Attempting to build with fallback methods...')
  
  // Method 1: Try npx vite
  try {
    console.log('Method 1: Trying npx vite build...')
    await runCommand('npx', ['vite', 'build'])
    console.log('✅ Build successful with npx vite!')
    return
  } catch (error) {
    console.log('❌ Method 1 failed:', error.message)
  }
  
  // Method 2: Try node with vite module
  try {
    console.log('Method 2: Trying node with vite module...')
    await runCommand('node', ['-e', `
      import('vite').then(({ build }) => 
        build({ logLevel: 'info' })
      ).then(() => console.log('Build complete'))
      .catch(err => { console.error(err); process.exit(1) })
    `])
    console.log('✅ Build successful with node vite module!')
    return
  } catch (error) {
    console.log('❌ Method 2 failed:', error.message)
  }
  
  // Method 3: Try direct node_modules path
  try {
    const vitePath = './node_modules/.bin/vite'
    if (existsSync(vitePath)) {
      console.log('Method 3: Trying direct vite path...')
      await runCommand('node', [vitePath, 'build'])
      console.log('✅ Build successful with direct path!')
      return
    }
  } catch (error) {
    console.log('❌ Method 3 failed:', error.message)
  }
  
  console.error('❌ All build methods failed!')
  process.exit(1)
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with code ${code}`))
      }
    })
    
    child.on('error', reject)
  })
}

runBuild()
