require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { getDb } = require('../src/utils/db');

async function exportData() {
  try {
    const db = await getDb();
    console.log('Connected to DB for Export...');

    // listCollections returns a cursor, use toArray to get the list
    const collections = await db.listCollections().toArray();
    
    // Create dump directory
    const dumpDir = path.join(__dirname, '../data_dump');
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }

    console.log(`Found ${collections.length} collections. Exporting to ${dumpDir}...`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      // Skip system collections
      if (colName.startsWith('system.')) continue;

      const data = await db.collection(colName).find({}).toArray();
      const filePath = path.join(dumpDir, `${colName}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Exported ${colName} (${data.length} docs)`);
    }

    console.log('🎉 Export Complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Export Failed:', error);
    process.exit(1);
  }
}

exportData();
