import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: ['https://smartdinein.vercel.app', 'http://localhost:5173', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/items', menuRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
