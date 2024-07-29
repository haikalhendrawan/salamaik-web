import express from 'express';
import path from "path";
import "dotenv/config"; 
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { createServer } from "http";
import { Server } from "socket.io";
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
import WsJunctionRoute from './routes/worksheetJunctionRoute';
import notFoundRoute from './routes/notFoundRoute';
//middleware
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
// ------------------------------------------------------------

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: process.env.CLIENT_URL,
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

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
app.use(WsJunctionRoute);
app.use(notFoundRoute);
app.use(errorHandler);

httpServer.listen(process.env.DEV_PORT, () => {
  logger.info(`Server is running on port ${process.env.DEV_PORT}`);
});