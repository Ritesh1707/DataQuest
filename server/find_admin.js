const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'hackathon';

async function findAdmin() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const user = await db.collection('User').findOne({ email: 'admin@hackathon.com' });
  console.log('Admin ID:', user._id.toString());
  await client.close();
}
findAdmin();
