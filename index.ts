import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/dbConnect';
import notesRouter from './routes/notes';
import folderRouter from './routes/folders';
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
app.use('/api/folders', folderRouter);

// Connection
dbConnect();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('App running in port: ' + PORT);
});
