import mongoose, { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  first_name: {
    type: String,
    maxLength: 50,
    minLength: 1,
    required: true
  },
  last_name: {
    type: String,
    maxLength: 50,
    minLength: 1,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const User = model('User', UserSchema);

export default User;
