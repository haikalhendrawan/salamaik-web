/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { Server, Socket } from "socket.io";
import { socketOption } from "./option";
import app from "./app";
import httpServer from "./httpServer";


const io = new Server(httpServer, socketOption);

export default io