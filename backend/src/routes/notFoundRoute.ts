import express, { Request, Response} from "express";

const router = express.Router();

router.all('*', (req: Request, res: Response) => {
  if (req.accepts('json')) {
    res.status(404).json({ success: false, message: '404 Endpoint Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

export default router