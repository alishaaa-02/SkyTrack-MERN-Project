const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Trainee = require('../models/Trainee');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads', 'medical-certificates');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.has(file.mimetype) || !allowedExtensions.has(ext)) {
      return cb(new Error('Medical Certificate must be a PDF, JPG, JPEG, or PNG file.'));
    }
    cb(null, true);
  }
});

const fields = ['name', 'email', 'phone', 'program', 'experience', 'address'];
const cleanBody = (body = {}) => {
  const data = {};
  for (const field of fields) {
    data[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
  }
  return data;
};

const removeFile = (filePath) => {
  if (filePath) fs.unlink(filePath, () => {});
};

const mongooseErrorMessage = (error) => {
  if (error?.name === 'ValidationError') {
    const first = Object.values(error.errors || {})[0];
    return first?.message || 'Please check the submitted trainee details.';
  }
  if (error?.name === 'CastError') return 'Invalid trainee ID.';
  if (error?.code === 11000) return 'A trainee with these details already exists.';
  return error?.message || 'Unable to save trainee.';
};

const fileDetails = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  path: path.relative(path.join(__dirname, '..'), file.path).replace(/\\/g, '/'),
  mimetype: file.mimetype,
  size: file.size
});

const uploadCertificate = (req, res, next) => {
  upload.single('medicalCertificate')(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ field: 'Medical Certificate', message: 'Medical Certificate must not exceed 5 MB.' });
    }
    return res.status(400).json({ field: 'Medical Certificate', message: error.message || 'Invalid Medical Certificate.' });
  });
};

router.get('/', async (_req, res) => {
  try {
    const trainees = await Trainee.find().sort({ createdAt: -1 });
    res.json(trainees);
  } catch (error) {
    console.error('GET trainees error:', error);
    res.status(500).json({ message: 'Unable to load trainees.' });
  }
});

router.get('/:id/medical-certificate', async (req, res) => {
  try {
    const trainee = await Trainee.findById(req.params.id);
    if (!trainee?.medicalCertificate?.path) {
      return res.status(404).json({ message: 'Medical Certificate not found.' });
    }
    const filePath = path.join(__dirname, '..', trainee.medicalCertificate.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Medical Certificate file not found on the server.' });
    }
    return res.download(filePath, trainee.medicalCertificate.originalName);
  } catch (error) {
    console.error('GET medical certificate error:', error);
    return res.status(400).json({ message: 'Invalid trainee ID.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const trainee = await Trainee.findById(req.params.id);
    if (!trainee) return res.status(404).json({ message: 'Trainee not found.' });
    res.json(trainee);
  } catch (error) {
    console.error('GET trainee error:', error);
    res.status(400).json({ message: 'Invalid trainee ID.' });
  }
});

const validateRequestBody = (body) => {
  const data = cleanBody(body);
  const checks = [
    ['name', !data.name ? 'Full Name is required.' : (!/^[A-Za-z][A-Za-z .\'-]*$/.test(data.name) ? 'Full Name may contain only letters, spaces, apostrophes, periods and hyphens.' : (data.name.length < 2 || data.name.length > 50 ? 'Full Name must be 2–50 characters.' : ''))],
    ['email', !data.email ? 'Email is required.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) ? 'Enter a valid email address.' : '')],
    ['phone', !data.phone ? 'Phone Number is required.' : (!/^[6-9]\d{9}$/.test(data.phone) ? 'Enter a valid 10-digit Indian mobile number starting with 6–9.' : '')],
    ['program', !programs.includes(data.program) ? 'Please select a valid training program.' : ''],
    ['experience', !experiences.includes(data.experience) ? 'Please select a valid experience level.' : ''],
    ['address', !data.address ? 'Address is required.' : (data.address.length < 10 || data.address.length > 300 ? 'Address must be 10–300 characters.' : '')]
  ];
  return checks.find(([, message]) => message) || null;
};

const programs = [
  'Commercial Pilot License',
  'Private Pilot License',
  'Instrument Rating',
  'Flight Instructor Course'
];
const experiences = ['Beginner', 'Intermediate', 'Advanced'];

router.post('/', uploadCertificate, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ field: 'Medical Certificate', message: 'Medical Certificate is required.' });
  }

  const validation = validateRequestBody(req.body);
  if (validation) {
    removeFile(req.file.path);
    return res.status(400).json({ field: validation[0], message: validation[1] });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      removeFile(req.file.path);
      return res.status(503).json({ message: 'MongoDB is not connected. Please start MongoDB and restart the server.' });
    }

    const trainee = new Trainee({
      ...cleanBody(req.body),
      medicalCertificate: fileDetails(req.file)
    });
    await trainee.save();
    return res.status(201).json(trainee);
  } catch (error) {
    removeFile(req.file.path);
    console.error('POST trainee error:', error);
    return res.status(400).json({
      field: error?.name === 'ValidationError' ? Object.keys(error.errors || {})[0] : undefined,
      message: mongooseErrorMessage(error),
      details: error?.errors ? Object.values(error.errors).map(e => e.message) : undefined
    });
  }
});

router.put('/:id', uploadCertificate, async (req, res) => {
  let newFile = req.file;
  try {
    const existing = await Trainee.findById(req.params.id);
    if (!existing) {
      if (newFile) removeFile(newFile.path);
      return res.status(404).json({ message: 'Trainee not found.' });
    }

    const update = cleanBody(req.body);
    update.medicalCertificate = newFile ? fileDetails(newFile) : existing.medicalCertificate;

    const trainee = await Trainee.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true, context: 'query' }
    );

    if (newFile && existing.medicalCertificate?.path) {
      removeFile(path.join(__dirname, '..', existing.medicalCertificate.path));
    }
    return res.json(trainee);
  } catch (error) {
    if (newFile) removeFile(newFile.path);
    console.error('PUT trainee error:', error);
    return res.status(400).json({ message: mongooseErrorMessage(error) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const trainee = await Trainee.findByIdAndDelete(req.params.id);
    if (!trainee) return res.status(404).json({ message: 'Trainee not found.' });
    if (trainee.medicalCertificate?.path) {
      removeFile(path.join(__dirname, '..', trainee.medicalCertificate.path));
    }
    res.json({ message: 'Trainee deleted successfully.' });
  } catch (error) {
    console.error('DELETE trainee error:', error);
    res.status(400).json({ message: 'Invalid trainee ID.' });
  }
});

module.exports = router;
