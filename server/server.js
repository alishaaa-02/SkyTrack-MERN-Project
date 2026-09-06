const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const traineeRoutes = require('./routes/traineeRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/trainees', traineeRoutes);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Always return JSON for unexpected API errors so the React client can handle them cleanly.
app.use((err, _req, res, _next) => {
  console.error('Unhandled API error:', err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
    app.listen(PORT, () => console.log(`SkyTrack API running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
start();
