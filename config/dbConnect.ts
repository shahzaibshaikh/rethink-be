import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function dbConnect() {
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(response => {
      console.log('MongoDB Connection Succeeded.');
    })
    .catch(error => {
      console.log('Error in DB connection: ' + error);
    });
}

export default dbConnect;
