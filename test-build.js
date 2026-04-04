#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🔨 Starting Next.js build...\n');

try {
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('\n✅ BUILD PASSED! No TypeScript errors.');
  process.exit(0);
} catch (error) {
  console.error('\n❌ BUILD FAILED! TypeScript errors found.');
  process.exit(1);
}


