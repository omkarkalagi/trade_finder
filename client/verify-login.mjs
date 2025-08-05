import { readFileSync } from 'fs'
import { resolve } from 'path'

console.log('🔍 Verifying Login component setup...')

try {
  // Check main.tsx
  const mainContent = readFileSync(resolve('src/main.tsx'), 'utf8')
  if (mainContent.includes("import Login from './components/Login'")) {
    console.log('✅ main.tsx correctly imports Login component')
  } else {
    console.log('❌ main.tsx does not import Login component correctly')
  }

  // Check Login.jsx exists and has restored original design
  const loginContent = readFileSync(resolve('src/components/Login.jsx'), 'utf8')
  if (loginContent.includes('bg-gray-50')) {
    console.log('✅ Login.jsx has restored original light theme')
  } else {
    console.log('❌ Login.jsx does not have restored original light theme')
  }

  if (loginContent.includes('by Omkar Kalagi')) {
    console.log('✅ Login.jsx has author attribution')
  } else {
    console.log('❌ Login.jsx missing author attribution')
  }

  if (loginContent.includes('RESTORED ORIGINAL LOGIN')) {
    console.log('✅ Login.jsx is the restored original version')
  } else {
    console.log('❌ Login.jsx is not the restored original version')
  }

  // Check that LoginPage.jsx is removed
  try {
    readFileSync(resolve('src/components/LoginPage.jsx'), 'utf8')
    console.log('❌ LoginPage.jsx still exists and should be removed')
  } catch (err) {
    console.log('✅ LoginPage.jsx successfully removed')
  }

  console.log('🎉 Login component verification complete!')

} catch (error) {
  console.error('❌ Verification failed:', error.message)
}
