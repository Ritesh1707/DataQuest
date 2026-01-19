const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs'); // Assuming we use this for internal consistency

const url = 'mongodb://localhost:27017';
const dbName = 'hackathon';

const firstNames = ['Alex', 'Sarah', 'Mike', 'Jessica', 'David', 'Emma', 'Daniel', 'Olivia', 'James', 'Sophia', 'Liam', 'Isabella', 'Ethan', 'Mia', 'Lucas', 'Charlotte', 'Mason', 'Amelia', 'Logan', 'Harper'];
const lastNames = ['Rivera', 'Chen', 'Ross', 'Kim', 'Patel', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomUser(i) {
  const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
  const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
  const name = `${firstName} ${lastName}`;
  const xp = getRandomInt(100, 15000);
  const level = Math.floor(xp / 1000) + 1;
  
  return {
    email: `player${i}@test.com`,
    password: 'hashed_password_placeholder', // We won't log in as them usually
    name: name,
    role: 'STUDENT',
    xp: xp,
    level: level,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to server');
    const db = client.db(dbName);
    const users = db.collection('User');

    // Keep existing admin/reviewer accounts mostly, or just clean everything except them?
    // Let's just append for now, or maybe careful cleanup.
    // For a cleaner leaderboard, let's delete "playerX" emails first.
    await users.deleteMany({ email: { $regex: /^player/ } });

    const newUsers = [];
    for (let i = 1; i <= 25; i++) {
      newUsers.push(generateRandomUser(i));
    }
    
    // Add a couple of "Whales" to top the leaderboard
    newUsers.push({
      email: 'legend@databricks.com',
      password: '...',
      name: 'Dr. Delta Lake',
      role: 'STUDENT',
      xp: 25400,
      level: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await users.insertMany(newUsers);
    
    console.log(`Seeded ${newUsers.length} users into the database.`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
