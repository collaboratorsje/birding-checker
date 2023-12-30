// pages/api/birds.js
import connectToDatabase from '../../utils/mongodb';
import mongoose from 'mongoose';

// Define the Mongoose schema for birds
const birdSchema = new mongoose.Schema({
  common_name: String,
  scientific_name: String,
});

// You can either use an existing model or create one if it doesn't exist yet
mongoose.models = mongoose.models || {};
const Bird = mongoose.models.Bird || mongoose.model('Bird', birdSchema, 'birds');

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  try {
    const birds = await Bird.find({}); // Use the Mongoose model to fetch birds
    res.json(birds);
  } catch (err) {
    console.error('Error fetching birds:', err);
    res.status(500).send('Internal Server Error');
  }
}