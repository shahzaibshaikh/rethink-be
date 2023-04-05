import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import serverless from 'serverless-http';
import notesRouter from './routes/notes';
import userRouter from './routes/users';

const app = express();
dotenv.config();

// Middleware Connections
app.use(cors());
app.use(express.json());

// Test Routes
app.get('/', async (req: Request, res: Response) => {
  res.status(200).send('Welcome to Rethink.');
});

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);

// Connection
dbConnect();

export default serverless(app);
