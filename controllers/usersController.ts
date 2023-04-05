import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserInterface from '../interfaces/User';
import User from '../models/User';

// POST register user
const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body as UserInterface;

    if (!first_name || !last_name || !email || !password)
      return res.status(400).json({ error: 'Please enter all required information' });

    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(409).json({ error: 'User already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword
    });

    user = await user.save();

    const responseData = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };

    const token = jwt.sign(
      {
        user_id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res
      .status(200)
      .json({ message: 'User has been registered', user: responseData, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST login user
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as UserInterface;

    if (!email || !password)
      return res.status(400).json({ error: 'Please enter both email and password.' });

    const user = await User.findOne({ email: email });
    if (!user) res.status(401).json({ error: 'Invalid username or password' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const responseData = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    };

    const token = jwt.sign(
      {
        user_id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .json({ message: 'User has been logged in.', user: responseData, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registerUser, loginUser };
