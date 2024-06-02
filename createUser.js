const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect("mongodb://127.0.0.1:27017/crmDB");

async function createUser(username, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword});
    await newUser.save();
    console.log(`User ${username} created successfully`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    mongoose.disconnect();
  }
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node createUser.js <username> <password> [role]');
  process.exit(1);
}

const [username, password] = args;
createUser(username, password);
