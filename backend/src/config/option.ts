/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import "dotenv/config";

export const socketOption = { 
  cors: {
    origin: [process.env.CLIENT_URL1, process.env.CLIENT_URL2]
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 3 * 60 * 1000,
    skipMiddlewares: true
  }
};

export const corsOption = {
  origin: [process.env.CLIENT_URL1, process.env.CLIENT_URL2],
  credentials: true
};