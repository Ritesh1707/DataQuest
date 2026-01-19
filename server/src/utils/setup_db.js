const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Manually read .env because dotenv might be failing on encoding or path
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);

let envVars = { ...process.env };

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      envVars[key] = value;
    }
  });
  console.log('DATABASE_URL loaded:', envVars.DATABASE_URL ? 'YES' : 'NO');
} catch (e) {
  console.error('Failed to read .env:', e.message);
}

const prismaOptions = { 
  stdio: 'inherit', 
  shell: true, 
  cwd: path.resolve(__dirname, '../../'),
  env: envVars 
};

try {
  console.log('--- Generatng Client ---');
  execSync('npx prisma generate', prismaOptions);
  
  console.log('--- Running Migration ---');
  execSync('npx prisma migrate dev --name init', prismaOptions);
  
  console.log('--- Seeding Database ---');
  const seedPath = path.resolve(__dirname, '../../prisma/seed.js');
  execSync(`node "${seedPath}"`, prismaOptions);
  
  console.log('--- DB Setup Complete ---');
} catch (error) {
  console.error('DB Setup failed:', error.message);
  process.exit(1);
}
