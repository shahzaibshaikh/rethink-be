import { Request, Response } from 'express';
import NoteInterface from '../interfaces/Note';
import UserInterface from '../interfaces/User';
import Note from '../models/Note';
import User from '../models/User';

// GET fetch all notes for a user
const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ is_deleted: false }).select(
      '_id title content created_at updated_at'
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

    if (note.is_deleted === true)
      return res.status(404).json({ message: 'Note with given ID was not found.' });

    res.status(200).json({ note: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new note
const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, user } = req.body as NoteInterface;

    const storedUser = (await User.findById(user)) as UserInterface;
    if (!storedUser)
      return res.status(404).json({ message: 'User with given ID was not found.' });

    let note = new Note({
      title: title,
      content: content,
      user: {
        user_id: storedUser._id,
        user_info: {
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          email: storedUser.email
        }
      }
    });
    note = await note.save();
    res.status(200).json({ message: 'Note created successfully.', note: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update note
const updateNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title, content, is_favorite } = req.body as NoteInterface;

    let note = await Note.findById(id);

    if (!note)
      return res.status(404).json({ message: 'Note with given ID was not found.' });

    if (title) note.title = title;
    if (content) note.content = content;
    if (is_favorite) note.is_favorite = is_favorite;
    note.updated_at = new Date();

    note = await note.save();

    res.status(200).json({ message: 'Note updated successfully.', note: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    let note = await Note.findById(id).select('_id title is_deleted');

    if (!note)
      return res.status(404).json({ message: 'Note with given ID was not found.' });

    if (note.is_deleted === true)
      return res.status(400).json({ message: 'Note with given ID is already deleted.' });

    note.is_deleted = true;
    await note.save();

    res.status(200).json({ message: 'Note deleted successfully.', note: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllNotes, getSpecificNote, createNote, updateNote, deleteNote };
