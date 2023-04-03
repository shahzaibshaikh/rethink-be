import { Request, Response } from 'express';
import Note from '../models/Note';

const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ is_deleted: false });

    if (notes.length === 0) return res.status(404).json({ message: 'No notes found.' });

    res.status(200).json({ notes: notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpecificNote = (req: Request, res: Response) => {};
const createNote = (req: Request, res: Response) => {};
const updateNote = (req: Request, res: Response) => {};
const deleteNote = (req: Request, res: Response) => {};

export { getAllNotes, getSpecificNote, createNote, updateNote, deleteNote };
