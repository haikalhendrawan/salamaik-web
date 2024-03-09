import express, {Request, Response} from 'express';
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({path: path.resolve(__dirname, '../.env')});

const app = express();

app.use(express.json());

app.get('/home', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/', (req: Request, res: Response) => {
  res.json({msg:"Hello World"});
});


app.listen(process.env.DEV_PORT, () => {
  console.log(`Server is running on port ${process.env.DEV_PORT}`);
});