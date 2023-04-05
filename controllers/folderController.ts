import { Response } from 'express';
import FolderInterface from '../interfaces/Folder';
import { AuthenticatedRequest } from '../middleware/auth';
import Folder from '../models/Folder';

const getAllFolders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user.user_id;
    const folders = await Folder.find({ user: user_id, is_deleted: false });

    if (folders.length === 0)
      return res.status(404).json({ error: 'No folders found for this user.' });

    res.status(200).json({ folders: folders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user.user_id;
    const { name } = req.body as FolderInterface;

    if (!name) return res.status(400).json({ error: 'Name field is required.' });

    let folder = new Folder({
      name: name,
      user: user_id
    });

    folder = await folder.save();

    res.status(200).json({ message: 'Folder created succesfully', folder: folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateFolder = async (req: AuthenticatedRequest, res: Response) => {};
const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {};

export { getAllFolders, createFolder, updateFolder, deleteFolder };
