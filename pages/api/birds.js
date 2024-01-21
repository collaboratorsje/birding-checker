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

  if (req.method === 'POST') {
    // This endpoint now expects a POST request with a body that includes bird IDs
    const { birdIds } = req.body;
    try {
      const birds = await Bird.find({
        '_id': { $in: birdIds.map(id => mongoose.Types.ObjectId(id)) }
      });
      res.json(birds);
    } catch (err) {
      console.error('Error fetching specific birds:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    // If it's not a POST request, return all birds
    try {
      const birds = await Bird.find({});
      res.json(birds);
    } catch (err) {
      console.error('Error fetching all birds:', err);
      res.status(500).send('Internal Server Error');
    }
  }
}
