import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const getAllFolders = async (req: AuthenticatedRequest, res: Response) => {
  try {
  } catch (error) {}
};
const createFolder = async (req: AuthenticatedRequest, res: Response) => {};
const updateFolder = async (req: AuthenticatedRequest, res: Response) => {};
const deleteFolder = async (req: AuthenticatedRequest, res: Response) => {};

export { getAllFolders, createFolder, updateFolder, deleteFolder };
