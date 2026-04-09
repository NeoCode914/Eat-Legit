import express from 'express';
import { authRouter } from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { foodRouter } from './routes/food.routes';

export const secret = process.env.JWT_SECRET || "YOUR SECRET KEY";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    credentials: true,
  })
);

app.use('/api/auth', authRouter);
app.use('/api/food', foodRouter);


