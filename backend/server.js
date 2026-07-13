import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from "./config/db.js";
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';

config();
connectDB();

const app = express();

app.use(cors());
app.use(json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API is running...'));

// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));