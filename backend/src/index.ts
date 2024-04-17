import express, {Request, Response} from 'express';
import path from "path";
import "dotenv/config"; 
import pool from '../config/db';

const app = express();

app.use(express.json());

app.get('/checklist', async(req: Request, res: Response) => {
  try{
    const result = await pool.query("SELECT * FROM checklist_ref");
    res.json(result.rows[0]);
  }catch(err){
    console.log(err)
    res.json(err)
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({msg:"Hello World"});
});

app.get('/check', (req: Request, res: Response) => {
  res.json({msg:"check home"});
});


app.listen(process.env.DEV_PORT, () => {
  console.log(`Server is running on port ${process.env.DEV_PORT}`);
});