import express, {Request, Response} from 'express';
import path from "path";
import "dotenv/config"; 
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from './config/logger';
//routes
import notifRoute from './routes/notifRoute';
import authRoute from './routes/authRoute';
import unitRoute from './routes/unitRoute';
import roleRoute from './routes/roleRoute';
import periodRoute from './routes/periodRoute';
import profileRoute from './routes/profileRoute';
import userRoute from './routes/userRoute';
import komponenRoute from './routes/komponenRoute';
import checklistRoute from './routes/checklistRoute';
import standardizationRoute from './routes/standardizationRoute';
import WorksheetRoute from './routes/worksheetRoute';
//middleware
import errorHandler from './middleware/errorHandler';
import notFoundHandler from './middleware/notFoundHandler';
import rateLimiter from './middleware/rateLimiter';
// ------------------------------------------------------------

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(rateLimiter);
app.use(authRoute);
app.use(unitRoute);
app.use(roleRoute);
app.use(periodRoute);
app.use(notifRoute);
app.use(profileRoute);
app.use(userRoute);
app.use(komponenRoute);
app.use(checklistRoute);
app.use(standardizationRoute);
app.use(WorksheetRoute);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.DEV_PORT, () => {
  logger.info(`Server is running on port ${process.env.DEV_PORT}`);
});