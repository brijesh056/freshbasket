const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection FAILED');
    console.error('Reason:', error.message);
    console.error('');
    console.error('👉 Check your server/.env file:');
    console.error('   - If using LOCAL MongoDB, make sure MongoDB is running (run: mongod)');
    console.error('   - If using ATLAS, make sure you replaced <db_password> with your REAL password');
    console.error('   - Your MONGO_URI should NOT contain < or > characters');
    console.error('');
    process.exit(1);
  }
};

module.exports = connectDB;
