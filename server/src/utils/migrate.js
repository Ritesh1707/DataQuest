require('dotenv').config({ path: '../../.env' }); // Load from server root
const { execSync } = require('child_process');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Not Found');

try {
  // Use shell: true to support npx command on Windows
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit', shell: true, cwd: '../../' });
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
