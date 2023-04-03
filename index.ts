import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes

// Connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('App running in port: ' + PORT);
});
