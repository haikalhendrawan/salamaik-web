import { Socket } from 'socket.io';
import wsJunction, {WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import { socketError } from '../model/error.model';
import logger from '../config/logger';


class WorksheetEvent{

   getWorksheetJunction(socket : Socket){
    socket.on("getData", async(data, callback) => {
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
 
    })
  }

  updateKanwilScore(socket: Socket){
    socket.on("updateKanwilScore", async(data, callback) => {
      try{
        const {worksheetId, junctionId, kanwilScore} = data;
        const result = await wsJunction.editWsJunctionKanwilScore( junctionId, worksheetId, kanwilScore);
        return callback({success: true, rows: result});

      }catch(err: any){
        return socketError(callback, err.message)
      }
    });
  }

  updateKPPNScore(socket: Socket){
    socket.on("updateKPPNScore", async(data, callback) => {
      try{
        const {worksheetId, junctionId, kppnScore} = data;
        const result = await wsJunction.editWsJunctionKPPNScore( junctionId, worksheetId, kppnScore);
        return callback({success: true, rows: result});

      }catch(err: any){
        return socketError(callback, err.message)
      }
    });
  }


}

const worksheetEvent = new WorksheetEvent();


export default worksheetEvent