import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

dotenv.config();

const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Health', 'Other'];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany();
    await Expense.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword // Pre-hashed to bypass pre-save hook in seeding for simplicity
    });

    const expenses = [];
    const now = new Date();

    for (let i = 0; i < 500; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomDaysAgo = Math.floor(Math.random() * 180); // Spread over 6 months
      const date = new Date(now);
      date.setDate(now.getDate() - randomDaysAgo);

      expenses.push({
        user: user._id,
        amount: Number((Math.random() * 100 + 10).toFixed(2)), // $10 to $110
        category: randomCategory,
        description: `Sample ${randomCategory} expense ${i}`,
        date
      });
    }

    await Expense.insertMany(expenses);
    console.log('Database seeded with demo user and 500 expenses!');
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
