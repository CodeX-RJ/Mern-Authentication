import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongoDB from './config/mongoDb.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Configure CORS properly
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.static(path.join(__dirname, '../Frontend/dist')))

// Routes
app.use('/api/auth', authRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

// MongoDB Connection + Server Start
connectToMongoDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port: ${process.env.PORT || 5000}`)
    );
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
  });
