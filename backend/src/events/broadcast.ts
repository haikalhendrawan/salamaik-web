/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { Socket } from 'socket.io';
import wsJunction, {WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import { socketError } from '../model/error.model';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import { validateScore } from '../utils/worksheetJunction.utils';
// ---------------------------------------------------------------------------------------------------