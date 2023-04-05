import { Response } from 'express';
import FolderInterface from '../interfaces/Folder';
import { AuthenticatedRequest } from '../middleware/auth';
import Folder from '../models/Folder';

// POST fetch all folders for a user
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

// POST create a new folder for a user
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

// PUT update a folder
const updateFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const folder_id = req.params.id;
    const { name } = req.body as FolderInterface;

    if (!name) return res.status(400).json({ error: 'Name field is required.' });

    let folder = await Folder.findById(folder_id);

    if (!folder)
      return res.status(404).json({ error: 'Folder with given ID does not exist.' });

    folder.name = name;
    folder.updated_at = new Date();

    folder = await folder.save();

    res.status(200).json({ message: 'Folder updated successfully.', folder: folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE delete a folder
const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {};

export { getAllFolders, createFolder, updateFolder, deleteFolder };
