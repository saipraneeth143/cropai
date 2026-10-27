require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const farmsRouter = require('./routes/farms');
const advisoryRouter = require('./routes/advisory');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration — supports multiple origins (local + Vercel production)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());

// Rate limiting – 100 requests per 15 minute window
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Routes
app.use('/api/farms', farmsRouter);
app.use('/api/advisory', advisoryRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CropAI server running on port ${PORT}`);
});
