import { Socket } from 'socket.io';
import wsJunction, {WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import { socketError } from '../model/error.model';


class WorksheetEvent{

   getWorksheetJunction(socket : Socket){
    socket.on("getData", async (data, callback) => {
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
}

const worksheetEvent = new WorksheetEvent();


export default worksheetEvent