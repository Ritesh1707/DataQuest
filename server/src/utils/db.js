const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const dbName = 'hackathon';

let db = null;

async function getDb() {
  if (db) return db;
  console.log('Connecting to Mongo via Native Driver:', url);
  try {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log('Native Mongo Connected');
    return db;
  } catch (e) {
    console.error('Native Mongo Connection Error:', e);
    throw e;
  }
}

module.exports = { getDb };
