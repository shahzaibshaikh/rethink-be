import { Request, Response } from 'express';
import Note from '../models/Note';

// GET fetch all notes for a user
const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ is_deleted: false }).select(
      '_id title created_at updated_at'
    );

    if (notes.length === 0)
      return res.status(404).json({ message: 'No notes found for this user.' });

    res.status(200).json({ notes: notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET fetch a specific note
const getSpecificNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note)
      return res.status(404).json({ message: 'Note with given ID was not found.' });

    res.status(200).json({ note: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new note
const createNote = (req: Request, res: Response) => {};
const updateNote = (req: Request, res: Response) => {};
const deleteNote = (req: Request, res: Response) => {};

export { getAllNotes, getSpecificNote, createNote, updateNote, deleteNote };
