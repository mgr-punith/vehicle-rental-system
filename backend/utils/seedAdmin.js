import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email: 'admin@example.com' });

    if (existingUser) {
      console.log('Admin already exists');
      process.exit();
    }

    await User.create({
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('Admin created successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();