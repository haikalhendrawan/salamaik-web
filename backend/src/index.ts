import express, {Request, Response} from 'express';
import path from "path";
import "dotenv/config"; 
import cors from "cors";
import cookieParser from 'cookie-parser';
//routes
import notifRoute from './routes/notifRoute';
import authRoute from './routes/authRoute';
import unitRoute from './routes/unitRoute';
import roleRoute from './routes/roleRoute';
import periodRoute from './routes/periodRoute';
import profileRoute from './routes/profileRoute';
import userRoute from './routes/userRoute';
//middleware
import errorHandler from './middleware/errorHandler';
// ------------------------------------------------------------

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(authRoute);
app.use(unitRoute);
app.use(roleRoute);
app.use(periodRoute);
app.use(notifRoute);
app.use(profileRoute);
app.use(userRoute);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({msg:"Hello World"});
});

app.listen(process.env.DEV_PORT, () => {
  console.log(`Server is running on port ${process.env.DEV_PORT}`);
});