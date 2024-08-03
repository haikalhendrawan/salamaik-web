import {useRef} from "react";
import { FormControl, TextField} from '@mui/material';
import { WsJunctionType } from "../../types";
import useSocket from "../../../../hooks/useSocket";
import useWsJunction from "../../useWsJunction";
import {useAuth} from "../../../../hooks/useAuth";
import useSnackbar from "../../../../hooks/display/useSnackbar";
// ------------------------------------------------------------
interface CatatanPropsType{
  wsJunction: WsJunctionType | null,
};
// ------------------------------------------------------------
export default function Catatan({wsJunction}: CatatanPropsType) {
  const initialNoteRef = useRef(wsJunction?.kanwil_note || '');

  const lastSavedNoteRef = useRef(wsJunction?.kanwil_note || "");

  const {auth} = useAuth();

  const {socket} = useSocket();

  const {openSnackbar} = useSnackbar();

  const {getWsJunctionKanwil} = useWsJunction();

  const handleEditKanwilNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentNote = e.target.value;

    if(currentNote === lastSavedNoteRef.current) {
      return
    };

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKanwilNote", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kanwilNote: currentNote,
      userName: auth?.name
    },
    async(response: any) => {
      try{
        console.log(response);
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        lastSavedNoteRef.current = currentNote;
      }catch(err:any){
        openSnackbar(err?.message, 'error');
      }

    });
  };
  return (
    <>
      <FormControl sx={{width:'100%', height:'100%', pr:1, pt:0.5}} key={wsJunction?.checklist_id}>
        <TextField 
          key={wsJunction?.checklist_id} 
          size='small' 
          defaultValue={initialNoteRef.current}
          onBlur={(e) => handleEditKanwilNote(e)} 
          multiline 
          minRows={6} 
          maxRows={6}
          fullWidth
          inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false,}} 
        />
      </FormControl>
    </>
    
  )
}
