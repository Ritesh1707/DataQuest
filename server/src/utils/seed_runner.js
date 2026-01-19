require('dotenv').config({ path: '../../.env' });
const { execSync } = require('child_process');
const path = require('path');

try {
  const seedPath = path.resolve(__dirname, '../../prisma/seed.js');
  console.log('Running seed file at:', seedPath);
  
  // Execute seed script
  execSync(`node "${seedPath}"`, { stdio: 'inherit', shell: true, cwd: path.dirname(seedPath) });
  console.log('Seed completed successfully');
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
