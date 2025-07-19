const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pro-rental';

async function printAdmins() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const admins = await db.collection('admin').find().toArray();
  console.log('Admins in database:');
  admins.forEach(admin => {
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      password: admin.password,
      phoneNumber: admin.phoneNumber
    });
  });
  await mongoose.disconnect();
}

printAdmins().catch(err => {
  console.error('Error printing admins:', err);
  mongoose.disconnect();
}); 