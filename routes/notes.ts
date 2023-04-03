import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Notes Router is up.');
});

export default router;
