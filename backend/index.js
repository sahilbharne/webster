import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import fs from 'fs';

// AI Services
import { analyzeImage } from './ai_services/vision_api_services/auto_tagger.js';

// Models
import User from './models/User.js';
import Artwork from './models/Artwork.js';

// --- 1. IMPORT ALL ROUTES ---
import uploadRoutes from './routes/upload.js';
import collectionRoutes from './routes/collections.js';
import userRoutes from './routes/users.js';
import artworkRoutes from './routes/artworks.js';
import followRoutes from './routes/follow.js';

// --- 2. INITIAL SETUP ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

// --- 3. MIDDLEWARE ---
// This section must come BEFORE the routes section.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));


// --- 4. API ROUTES ---
// This section must come AFTER the middleware section.
app.use('/api/upload', uploadRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/collections', collectionRoutes);


// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, /* ... limits and fileFilter ... */ });
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('No MongoDB URI found in .env file');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};


// ==================== OTHER ROUTES (WEBHOOKS, HEALTH, ETC.) ====================
app.post('/api/webhooks/clerk', async (req, res) => { /* ... your webhook logic ... */ });
app.post('/api/auto-tag', upload.single('image'), async (req, res) => { /* ... your auto-tag logic ... */ });
app.post('/api/upload-with-tags', upload.single('image'), async (req, res) => { /* ... your upload logic ... */ });
app.get('/api/health', (req, res) => { /* ... your health check logic ... */ });
app.get('/api/protected', ClerkExpressRequireAuth(), (req, res) => { /* ... your protected route logic ... */ });
app.get('/api/me', ClerkExpressRequireAuth(), async (req, res) => { /* ... your /api/me logic ... */ });


// ==================== ERROR HANDLING ====================
// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error Handler:', err);
  // ... your error handling logic
  res.status(500).json({ success: false, error: 'Internal server error' });
});
// 404 handler for any routes not found
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});


// ==================== SERVER START ====================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server Started on Port: ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error);
});