import { Request, Response } from 'express';

const getAllNotes = (req: Request, res: Response) => {
  res.status(200).send('Notes Router is up.');
};

const getSpecificNote = (req: Request, res: Response) => {};
const createNote = (req: Request, res: Response) => {};
const updateNote = (req: Request, res: Response) => {};
const deleteNote = (req: Request, res: Response) => {};

export { getAllNotes, getSpecificNote, createNote, updateNote, deleteNote };
