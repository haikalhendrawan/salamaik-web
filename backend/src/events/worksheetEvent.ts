import { Socket } from 'socket.io';
import wsJunction, {WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import { socketError } from '../model/error.model';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
// ---------------------------------------------------------------------------------------------------

class WorksheetEvent{

  async getWorksheetJunction(data: any, callback: any) {
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
          rows: result
        });
      }catch(err: any){
        return socketError(callback, err.message)
      }
  }

  async updateKanwilScore(data: any, callback: any) {
    try{
      const {worksheetId, junctionId, kanwilScore, userName} = data;
      const result = await wsJunction.editWsJunctionKanwilScore( junctionId, worksheetId, kanwilScore, userName);
      return callback({success: true, rows: result});

    }catch(err: any){
      return socketError(callback, err.message)
    }
  }

  async updateKPPNScore(data: any, callback: any) {
    try{
      const {worksheetId, junctionId, kppnScore, userName} = data;
      const result = await wsJunction.editWsJunctionKPPNScore( junctionId, worksheetId, kppnScore, userName);
      return callback({success: true, rows: result});

    }catch(err: any){
      return socketError(callback, err.message)
    }
  }

  async updateKanwilNote(data: any, callback: any) {
    try{
      const {worksheetId, junctionId, kanwilNote, userName} = data; 
      const result = await wsJunction.editWsJunctionKanwilNote( junctionId, worksheetId, kanwilNote, userName);
      return callback({success: true, rows: result});
    }catch(err: any){
      return socketError(callback, err.message)
    }
  }

  async deleteWsJunctionFile(data: any, callback: any){
    try{
      const {id, fileName, option} = data;
      const result = await wsJunction.deleteWsJunctionFile(id, option);
  
      const filePath = path.join(__dirname,`../uploads/`, fileName);
      fs.unlinkSync(filePath);
      return callback({success: true, rows: result});
   
    }catch(err: any){
      return socketError(callback, err.message)
    }
  }

}

const worksheetEvent = new WorksheetEvent();


export default worksheetEvent