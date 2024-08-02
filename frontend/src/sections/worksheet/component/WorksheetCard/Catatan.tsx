import {useState, useRef} from "react";
import { FormControl, TextField} from '@mui/material';
import { WsJunctionType } from "../../types";
import useSocket from "../../../../hooks/useSocket";
import useWsJunction from "../../useWsJunction";
import {useAuth} from "../../../../hooks/useAuth";
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

  const {getWsJunctionKanwil} = useWsJunction();

  const handleEditKanwilNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentNote = e.target.value;

    if(currentNote === lastSavedNoteRef.current) {
      return
    };

    console.log('edit');
    console.log(auth);
    console.log(socket);

    socket?.emit("updateKanwilNote", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kanwilNote: currentNote,
      userName: auth?.name
    },
    (response: any) => {
      console.log(response);
      getWsJunctionKanwil(wsJunction?.kppn_id || '');
      lastSavedNoteRef.current = currentNote;
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
