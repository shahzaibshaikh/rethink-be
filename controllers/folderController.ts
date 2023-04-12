import { Response } from 'express';
import FolderInterface from '../interfaces/Folder';
import { AuthenticatedRequest } from '../middleware/auth';
import Folder from '../models/Folder';
import Note from '../models/Note';

// POST fetch all folders for a user
const getAllFolders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user.user_id;
    const folders = await Folder.find({ user: user_id, is_deleted: false });

    if (folders.length === 0)
      return res.status(200).json({ error: 'No folders found for this user.' });

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

    const folderCheck = await Folder.find({
      name: name,
      user: user_id,
      is_deleted: false
    });
    if (folderCheck.length > 0)
      return res.status(400).json({ error: 'Folder with this name already exists.' });

    let folder = new Folder({
      name: name,
      user: user_id
    });

    folder = await folder.save();

    res.status(200).json({ message: 'Folder created succesfully.', folder: folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update a folder
const updateFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user_id = req.user.user_id;
    const folder_id = req.params.id;
    const { name } = req.body as FolderInterface;

    if (!name) return res.status(400).json({ error: 'Name field is required.' });

    const folderCheck = await Folder.find({ name: name, user: user_id });
    if (folderCheck.length > 0)
      return res.status(400).json({ error: 'Folder with this name already exists.' });

    let folder = await Folder.findById(folder_id);

    if (!folder || folder.is_deleted)
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
const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const folder_id = req.params.id;
    let folder = await Folder.findById(folder_id);
    if (!folder)
      return res.status(404).json({ error: 'Folder with given ID does not exist.' });

    if (folder.user.toString() !== req.user.user_id)
      return res
        .status(401)
        .json({ error: 'The folder you are trying to delete does not belong to you.' });

    if (folder.is_deleted === true)
      return res.status(400).json({ error: 'Folder with given ID is already deleted.' });

    folder.is_deleted = true;
    folder = await folder.save();
    const notesToUpdate = Note.find({
      is_deleted: false,
      'folder.folder_id': folder._id
    });
    console.log(notesToUpdate);

    res.status(200).json({ message: 'Folder deleted successfully.', folder: folder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllFolders, createFolder, updateFolder, deleteFolder };
