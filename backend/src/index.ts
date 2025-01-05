/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from 'express';
import path from "path";
import "dotenv/config"; 
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import compression from 'compression';
//instance
import app from './config/app';
import io from './config/io';
import httpServer from './config/httpServer';
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
import findingsRoute from './routes/findingsRoute';
import matrixRoute from './routes/matrixRoute';
import miscRoute from './routes/miscRoute';
import activityRoute from './routes/activityRoute';
import commentRoute from './routes/commentRoute';
//middleware
import errorHandler from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
//socket events
import connectEvent from './events';
import socketAuthenticate from './middleware/socketAuthenticate';
//utils and option
import { corsOption } from './config/option';
// -----------------------------------------------------------
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors(corsOption));

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
app.use(matrixRoute);
app.use(findingsRoute);
app.use(miscRoute);
app.use('/comment', commentRoute);
app.use(activityRoute);
app.use(notFoundRoute);
app.use(errorHandler);

io.use(socketAuthenticate);
io.on('connection', connectEvent);

httpServer.listen(process.env.DEV_PORT, () => {
  logger.info(`Server is running on port ${process.env.DEV_PORT}`);
});