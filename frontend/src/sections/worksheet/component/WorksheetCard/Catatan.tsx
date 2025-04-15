/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useRef, useState, useEffect, useMemo} from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Skeleton  from "@mui/material/Skeleton";
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { WsJunctionType, WorksheetType } from "../../types";
import useSocket from "../../../../hooks/useSocket";
import useWsJunction from "../../useWsJunction";
import {useAuth} from "../../../../hooks/useAuth";
import useSnackbar from "../../../../hooks/display/useSnackbar";
// ------------------------------------------------------------
interface CatatanPropsType{
  wsJunction: WsJunctionType | null,
  wsDetail: WorksheetType | null,
};

const StyledFormControl = styled(FormControl)(({theme}) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));

// ------------------------------------------------------------
export default function Catatan({wsJunction, wsDetail}: CatatanPropsType) {
  const [isMounted, setIsMounted] = useState(true);

  const initialNoteRef = useRef(wsJunction?.kanwil_note || '');

  const lastSavedNoteRef = useRef(wsJunction?.kanwil_note || "");

  const {auth} = useAuth();

  const {socket} = useSocket();

  const {openSnackbar} = useSnackbar();

  const {getWsJunctionKanwil} = useWsJunction();

  const isPastDue = useMemo(() => new Date().getTime() > new Date(wsDetail?.close_period || "").getTime(), [wsDetail]);

  const isKanwil = useMemo(() =>{
    return auth?.kppn?.length === 5;
  }, [auth]);

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

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return <Box marginRight={2}> <Skeleton variant="rounded" height={'150px'} width={'100%'} /> </Box>;
  ;}

  return (
    <>
      <StyledFormControl>
        <TextField 
          size='small' 
          defaultValue={initialNoteRef.current}
          onBlur={(e) => handleEditKanwilNote(e)} 
          multiline 
          minRows={6} 
          maxRows={6}
          fullWidth
          inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false}} 
          disabled={!isKanwil || isPastDue}
        />
      </StyledFormControl>
    </>
    
  )
}
