import { Response } from 'express';
import mongoose from 'mongoose';
import NoteInterface from '../interfaces/Note';
import { AuthenticatedRequest } from '../middleware/auth';
import Folder from '../models/Folder';
import Note from '../models/Note';

// GET fetch all notes for a user
const getAllNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 30;

    const notes = await Note.find({ 'user.user_id': req.user.user_id, is_deleted: false })
      .select('_id title content created_at updated_at folder is_favorite')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ updated_at: -1 });

    if (notes.length === 0)
      return res.status(404).json({ error: 'No notes found for this user.' });

    res.status(200).json({ notes: notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET fetch a specific note
const getSpecificNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, is_deleted: false });

    if (!note)
      return res.status(404).json({ error: 'Note with given ID was not found.' });

    if (note.user.user_id.toString() !== req.user.user_id)
      return res
        .status(401)
        .json({ error: 'The note you requested does not belong to you.' });

    if (note.is_deleted === true)
      return res.status(404).json({ error: 'Note with given ID was not found.' });

    res.status(200).json({ note: note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET fetch all notes from a particular folder
const getSpecificFolderNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const folder_id = req.params.folderId;
    const user_id = req.user.user_id;

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 30;

    const notes = await Note.find({
      'folder.folder_id': folder_id,
      is_deleted: false,
      'user.user_id': user_id
    })
      .select('_id title content created_at updated_at folder is_favorite')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ updated_at: -1 });

    if (!notes) return res.status(404).json({ error: 'This folder is empty.' });
    res.status(200).json({ notes: notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create a new note
const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, folder_id } = req.body as NoteInterface;

    let folder;
    if (folder_id) {
      folder = await Folder.findById(folder_id);
      if (!folder)
        return res.status(404).json({ error: 'Folder with this ID does not exist.' });
    }

    let note = new Note({
      title: title,
      content: content,
      user: {
        user_id: req.user.user_id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email
      }
    });

    if (folder) {
      note.folder = {
        folder_id: new mongoose.Types.ObjectId(folder_id),
        name: folder.name
      };
    }

    note = await note.save();
    res.status(200).json({ message: 'Note created successfully.', note: note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update note
const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { title, content, is_favorite, folder_id } = req.body as NoteInterface;

    let note = await Note.findById(id);

    if (note.is_deleted === true)
      return res.status(400).json({ error: 'Note does not exist anymore.' });

    if (!note)
      return res.status(404).json({ error: 'Note with given ID was not found.' });

    if (note.user.user_id.toString() !== req.user.user_id)
      return res
        .status(401)
        .json({ error: 'The note you are trying to edit does not belong to you.' });

    if (title) note.title = title;
    if (content) note.content = content;
    if (is_favorite) note.is_favorite = is_favorite;
    if (folder_id) {
      const folder = await Folder.findById(folder_id);

      if (!folder) return res.status(404).json({ error: 'Folder does not exist.' });

      note.folder.folder_id = folder._id;
      note.folder.name = folder.name;
    }
    note.updated_at = new Date();

    note = await note.save();

    res.status(200).json({ message: 'Note updated successfully.', note: note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE delete a note
const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;

    let note = await Note.findById(id).select('_id title is_deleted');

    if (!note)
      return res.status(404).json({ error: 'Note with given ID was not found.' });

    if (note.user.user_id.toString() !== req.user.user_id)
      return res
        .status(401)
        .json({ error: 'The note you are trying to delete does not belong to you.' });

    if (note.is_deleted === true)
      return res.status(400).json({ error: 'Note with given ID is already deleted.' });

    note.is_deleted = true;
    note = await note.save();

    res.status(200).json({ message: 'Note deleted successfully.', note: note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllNotes,
  getSpecificNote,
  getSpecificFolderNote,
  createNote,
  updateNote,
  deleteNote
};
