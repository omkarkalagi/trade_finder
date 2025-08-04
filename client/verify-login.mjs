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

  // Check Login.jsx exists and has light theme
  const loginContent = readFileSync(resolve('src/components/Login.jsx'), 'utf8')
  if (loginContent.includes('bg-gradient-to-br from-gray-50 via-white to-gray-100')) {
    console.log('✅ Login.jsx has light theme styling')
  } else {
    console.log('❌ Login.jsx does not have light theme styling')
  }

  if (loginContent.includes('v2.1 - Light Theme')) {
    console.log('✅ Login.jsx has version identifier')
  } else {
    console.log('❌ Login.jsx missing version identifier')
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
