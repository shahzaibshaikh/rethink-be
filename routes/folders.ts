import express from 'express';
import {
  getAllFolders,
  createFolder,
  updateFolder,
  deleteFolder
} from '../controllers/folderController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAllFolders);
router.post('/', auth, createFolder);
router.put('/:id', auth, updateFolder);
router.delete('/:id', auth, deleteFolder);

export default router;
