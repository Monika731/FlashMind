require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const uploadRoute = require('./routes/upload');
const generateRoute = require('./routes/generate');
const decksRoute = require('./routes/decks');
const reviewRoute = require('./routes/review');
const speakRoute = require('./routes/speak');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', uploadRoute);
app.use('/api', generateRoute);
app.use('/api', decksRoute);
app.use('/api', reviewRoute);
app.use('/api', speakRoute);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flashcards';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Starting without DB (cards wont persist)...');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  });
