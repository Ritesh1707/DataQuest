const { getDb } = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await getDb();
    const users = db.collection('User');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name: name || 'User',
      xp: 0,
      level: 1,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const token = jwt.sign(
      { userId: result.insertedId.toString(), role: 'USER' },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        email,
        name: name || 'User',
        level: 1,
        xp: 0
      }
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await getDb();
    const users = db.collection('User');

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role || 'USER' },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        level: user.level || 1,
        xp: user.xp || 0
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
};
