import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getSpecificNote,
  getSpecificFolderNote,
  updateNote
} from '../controllers/notesController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAllNotes);
router.get('/:id', auth, getSpecificNote);
router.get('/folder/:folderId', auth, getSpecificFolderNote);
router.post('/', auth, createNote);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);

export default router;
