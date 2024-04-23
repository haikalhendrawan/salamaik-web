import express, {Request, Response} from 'express';
import path from "path";
import "dotenv/config"; 
import cors from "cors";

//routes
import notifRoute from './routes/notifRoute';

const app = express();
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use(notifRoute);

app.get('/', (req: Request, res: Response) => {
  res.json({msg:"Hello World"});
});


app.listen(process.env.DEV_PORT, () => {
  console.log(`Server is running on port ${process.env.DEV_PORT}`);
});