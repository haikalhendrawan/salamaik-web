import { Socket } from 'socket.io';
import wsJunction, {WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import { socketError } from '../model/error.model';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import { validateScore } from '../utils/worksheetJunction.utils';
// ---------------------------------------------------------------------------------------------------

class WorksheetEvent{

  async getWorksheetJunction(socket: Socket, data: any, callback: any) {
     try{
        const {kppn, period} = data;

        const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
        const worksheetId = worksheetData.length>0? worksheetData[0].id : null;
    
        if(!worksheetId) {
          return socketError(callback, 'Worksheet not found')
        };
    
        const result: WsJunctionJoinChecklistType[] = await wsJunction.getWsJunctionByWorksheetId(worksheetId);
    
        if(!result || result.length===0) {
          return socketError(callback, 'Worksheet is not assigned')
        };
  
        return callback({
          success: true,
          rows: result,
          message: 'Get worksheet success'
        });
      }catch(err: any){
        logger.error(err);
        return socketError(callback, err.message)
      }
  }

  async updateKanwilScore(socket: Socket, data: any, callback: any) {
    try{
      const {name} = socket.data.payload;
      const {worksheetId, junctionId, kanwilScore} = data;

      const wsJunctionDetail = await wsJunction.getWsJunctionByJunctionId(junctionId);
      const availableOpsi = wsJunctionDetail?.opsi;
      const isStandardisasi = wsJunctionDetail?.standardisasi===1? true : false;
      const isValidScore = validateScore(kanwilScore, availableOpsi, isStandardisasi);

      if(!isValidScore){
        return socketError(callback, 'Score invalid')
      };

      const result = await wsJunction.editWsJunctionKanwilScore( junctionId, worksheetId, kanwilScore, name);

      socket.broadcast.emit('kanwilScoreHasUpdated', {worksheetId, junctionId, kanwilScore});

      return callback({success: true, rows: result, message: 'Nilai has been updated'});

    }catch(err: any){
      logger.error(err);
      return socketError(callback, err.message)
    }
  }

  async updateKPPNScore(socket: Socket, data: any, callback: any) {
    try{
      const {name} = socket.data.payload;
      const {worksheetId, junctionId, kppnScore} = data;

      const wsJunctionDetail = await wsJunction.getWsJunctionByJunctionId(junctionId);
      const availableOpsi = wsJunctionDetail?.opsi;
      const isStandardisasi = wsJunctionDetail?.standardisasi===1? true : false;
      const isValidScore = validateScore(kppnScore, availableOpsi, isStandardisasi);

      if(!isValidScore){
        return socketError(callback, 'Score invalid')
      };

      const result = await wsJunction.editWsJunctionKPPNScore( junctionId, worksheetId, kppnScore, name);

      socket.broadcast.emit('KPPNScoreHasUpdated', {worksheetId, junctionId, kppnScore});

      return callback({success: true, rows: result, message: 'Nilai has been updated'});

    }catch(err: any){
      logger.error(err);
      return socketError(callback, err.message)
    }
  }

  async updateKanwilNote(socket: Socket, data: any, callback: any) {
    try{
      const {name} = socket.data.payload;
      const {worksheetId, junctionId, kanwilNote} = data; 
      const result = await wsJunction.editWsJunctionKanwilNote( junctionId, worksheetId, kanwilNote, name);

      socket.broadcast.emit('kanwilNoteHasUpdated', {worksheetId, junctionId, kanwilNote});

      return callback({success: true, rows: result, message: 'Note has been updated'});
    }catch(err: any){
      logger.error(err);
      return socketError(callback, err.message)
    }
  }

  async deleteWsJunctionFile(socket: Socket, data: any, callback: any){
    try{
      const {name} = socket.data.payload;
      const {id, fileName, option} = data;

      const result = await wsJunction.deleteWsJunctionFile(id, option, name);
      
      const filePath = path.join(__dirname,`../uploads/`, fileName);
      fs.unlinkSync(filePath);

      socket.broadcast.emit('wsJunctionFileHasDeleted', {id, fileName, option});

      return callback({success: true, rows: result, message: 'File deleted successfully'});   
    }catch(err: any){
      logger.error(err);
      return socketError(callback, err.message)
    }
  }

}

const wsEvent = new WorksheetEvent();

export default function worksheetEventListener(socket: Socket) {
  socket.on("getWorksheetJunction", (data, callback) => wsEvent.getWorksheetJunction(socket, data, callback));
  socket.on("updateKanwilScore", (data, callback) => wsEvent.updateKanwilScore(socket, data, callback));
  socket.on("updateKPPNScore", (data, callback) => wsEvent.updateKPPNScore(socket, data, callback));
  socket.on("updateKanwilNote", (data, callback) => wsEvent.updateKanwilNote(socket, data, callback));
  socket.on("deleteWsJunctionFile", (data, callback) => wsEvent.deleteWsJunctionFile(socket, data, callback));
};
