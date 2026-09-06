const mongoose = require('mongoose');

const programs = [
  'Commercial Pilot License',
  'Private Pilot License',
  'Instrument Rating',
  'Flight Instructor Course'
];
const experiences = ['Beginner', 'Intermediate', 'Advanced'];

const traineeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50, match: /^[A-Za-z][A-Za-z .'-]*$/ },
  email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ },
  phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  program: { type: String, required: true, enum: programs },
  experience: { type: String, required: true, enum: experiences },
  address: { type: String, required: true, trim: true, minlength: 10, maxlength: 300 },
  medicalCertificate: {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true, max: 5 * 1024 * 1024 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Trainee', traineeSchema);
