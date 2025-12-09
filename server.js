const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// require('dotenv').config(); // COMMENTED FOR RENDER DEPLOYMENT

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// mongodb connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// routes
const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);

// serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/history', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'history.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});