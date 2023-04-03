import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import notesRouter from './routes/notes';

const app = express();
dotenv.config();

// Middleware Connections
app.use(cors());
app.use(express.json());

// Test Routes
app.get('/', async (req: Request, res: Response) => {
  res.status(200).send('Welcome to first route.');
});

app.use('/notes', notesRouter);

// Connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('App running in port: ' + PORT);
  dbConnect();
});
