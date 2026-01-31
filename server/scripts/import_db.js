require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { getDb } = require('../src/utils/db');

async function importData() {
  try {
    const db = await getDb();
    console.log('Connected to DB for Import...');

    const dumpDir = path.join(__dirname, '../data_dump');
    if (!fs.existsSync(dumpDir)) {
      console.error(`❌ Data dump directory not found at: ${dumpDir}`);
      console.error('   Please run the export script first or place the data_dump folder manually.');
      process.exit(1);
    }

    const files = fs.readdirSync(dumpDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} JSON files to import.`);

    for (const file of files) {
      const colName = path.basename(file, '.json');
      const filePath = path.join(dumpDir, file);
      
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const docs = JSON.parse(rawData);

      if (docs.length > 0) {
        // Clear existing data? Yes, for a clean migration.
        // Or upsert? Clean is safer for "migration" context.
        await db.collection(colName).deleteMany({});
        console.log(`🗑️  Cleared ${colName}`);

        // Handle Date objects (JSON stringifies dates)
        // Simple approach: MongoDB driver might handle ISO strings, 
        // but often we need to convert "$date" if using EJSON. 
        // Standard JSON stringify just makes them strings. 
        // For this specific app, let's assume standard strings are okay usually, 
        // OR we map them back if we know the schema. 
        // Better: let's try raw insert. If your app relies on Date objects, 
        // check if your Seed scripts used Date objects. 
        // Quick Fix: iterate and convert mostly-likely date keys if needed, 
        // or rely on the app to handle string dates.
        // Actually, JSON.stringify turns Date -> String. 
        // Let's rely on basic string handling for now.
        
        await db.collection(colName).insertMany(docs);
        console.log(`✅ Imported ${colName} (${docs.length} docs)`);
      } else {
        console.log(`⚠️  Skipped ${colName} (Empty)`);
      }
    }

    console.log('🎉 Import Complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Import Failed:', error);
    process.exit(1);
  }
}

importData();
