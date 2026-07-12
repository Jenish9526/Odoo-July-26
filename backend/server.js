import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';

import vehicleRoutes from './routes/vehicleRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'TransitOps Backend Running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'TransitOps',
  })
  .then(() => {
    console.log('✓ MongoDB Atlas connected successfully');
    console.log(`✓ Database: TransitOps`);
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  });
