/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { createServer } from "http";
import app from "./app";

const httpServer = createServer(app);

export default httpServer