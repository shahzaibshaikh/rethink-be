import express from 'express';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getSpecificNote,
  updateNote
} from '../controllers/notesController';

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getSpecificNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
