# ✈️ SkyTrack – Pilot Training & Progress Tracking System

SkyTrack is a **MERN-based web application** designed to manage pilot training programs and trainee information. It provides a simple and user-friendly platform for trainee registration, training program information, medical certificate management, and trainee record management.

## 🌐 Live Demo

🚀 **View the deployed SkyTrack application:**  
https://sky-track-mern-project.vercel.app

---

## 🎯 Purpose & Use of the Website

The main purpose of SkyTrack is to provide a **centralized digital platform for managing pilot trainees and their training information**.

In a traditional training environment, trainee information such as personal details, selected training programs, experience level, and medical certificates may be maintained through separate forms or manual records. SkyTrack brings these activities together into a single web application.

The website can be used by a **flight training organization or aviation academy** to:

- ✈️ Register new pilot trainees digitally
- 👥 Maintain trainee information in a centralized database
- 📚 Record the training program selected by each trainee
- 📄 Store and manage medical certificate information
- ✏️ Update trainee information whenever required
- 🗑️ Remove outdated or incorrect trainee records
- 🔍 Search and view registered trainees
- ✈️ Provide information about different pilot training programs
- 🎓 Introduce prospective trainees to available aviation courses
- 🖼️ Showcase aviation-related images and training videos

SkyTrack demonstrates how a **full-stack web application** can connect a React frontend with an Express/Node.js backend and MongoDB database to perform real-time CRUD operations.

### 👥 Intended Users

The website is primarily designed for:

- ✈️ Pilot Training Institutes
- 👨‍✈️ Pilot Trainees
- 👩‍✈️ Flight Instructors
- 🏫 Aviation Academies
- 👨‍💼 Training Administrators

---

## 📌 Project Overview

SkyTrack allows users to:

- Register as a trainee
- Select a pilot training program
- Upload a medical certificate
- View registered trainees
- Search trainee records
- Edit trainee information
- Delete trainee records
- Download uploaded medical certificates
- Explore available pilot training programs
- View aviation-related images and videos
- Use dark mode for better viewing

The application follows a **MERN architecture**, with React used for the frontend, Node.js and Express.js for the backend, and MongoDB for data storage.

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- REST API
- Multer

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Deployment

- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database
- GitHub – Source Code Management

---

## ✨ Features

### 👨‍✈️ Trainee Registration

Users can register by providing:

- Full Name
- Email
- Phone Number
- Training Program
- Experience Level
- Medical Certificate
- Address

### 📄 Medical Certificate Management

- Upload medical certificates in PDF, JPG, JPEG, or PNG format
- Maximum file size of 5 MB
- View/remove selected certificate before submission
- Download certificates from the Registered Trainees section
- Replace an existing certificate while editing a trainee

### 👥 Trainee Management

- View all registered trainees
- Search trainees
- Edit trainee information
- Delete trainee records
- Data is stored in MongoDB Atlas

### ✈️ Training Programs

The application provides information about:

- Commercial Pilot License (CPL)
- Private Pilot License (PPL)
- Instrument Rating
- Flight Instructor Course

### 🖼️ Gallery

The Gallery section contains aviation-related:

- Images
- Aircraft videos
- Pilot training media

### 🎬 Aircraft Landing Video

The home page includes an aircraft landing video to provide an aviation-focused visual introduction to the website.

### 🌙 Dark Mode

Users can switch between light and dark themes. The selected theme is stored using browser Local Storage.

### ✅ Form Validation

The application includes client-side and server-side validation for registration data.

Invalid fields are highlighted with appropriate validation messages.

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │       GitHub        │
                    │    Source Code      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │     Vercel      │        │     Render      │
        │ React Frontend  │───────►│ Node/Express API│
        └─────────────────┘        └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │ MongoDB Atlas   │
                                   │    Database     │
                                   └─────────────────┘