import express, {Request, Response} from 'express';
import path from "path";
import "dotenv/config"; 
import cors from "cors";
import cookieParser from 'cookie-parser';

//routes
import notifRoute from './routes/notifRoute';
import authRoute from './routes/authRoute';
//middleware
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(authRoute);
app.use(notifRoute);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({msg:"Hello World"});
});

app.listen(process.env.DEV_PORT, () => {
  console.log(`Server is running on port ${process.env.DEV_PORT}`);
});