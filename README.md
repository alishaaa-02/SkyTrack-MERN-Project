# SkyTrack MERN Lab 4

A MERN stack pilot training and progress tracking system.

## Stack
- MongoDB + Mongoose
- Express.js
- React + Vite
- Node.js

## Features
- Pilot trainee registration and CRUD
- Same validation rules for Add and Edit
- One validation popup at a time (the first invalid field is shown first)
- Field-level validation on blur
- Medical Certificate upload (PDF/JPG/JPEG/PNG, max 5 MB)
- Medical Certificate view/download in Registered Trainees
- Training Programs including Flight Instructor Course
- Training card hover effects
- Lab 3 Gallery and videos
- Gallery hover effects
- Search registered trainees

## Run
1. Install Node.js and MongoDB.
2. Make sure MongoDB is running locally.
3. From this folder run:

   npm install
   npm run install-all
   npm run dev

4. Open http://localhost:5173

The React app runs on port 5173 and proxies /api requests to Express on port 5000.

## MongoDB
The default connection is:
`mongodb://127.0.0.1:27017/skytrack`

Change `server/.env` if needed.
