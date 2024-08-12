import {useRef, useState, useEffect, useMemo} from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Skeleton  from "@mui/material/Skeleton";
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import useSocket from "../../../../hooks/useSocket";
import { WsJunctionType } from "../../../worksheet/types";
import useWsJunction from "../../../worksheet/useWsJunction";
import {useAuth} from "../../../../hooks/useAuth";
import useSnackbar from "../../../../hooks/display/useSnackbar";
import { FindingsResponseType } from "../../types";
// ------------------------------------------------------------
interface CatatanPropsType{
  findingResponse: FindingsResponseType | null,
};

const StyledFormControl = styled(FormControl)(({theme}) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));

// ------------------------------------------------------------
export default function Catatan({findingResponse}: CatatanPropsType) {
  const [isMounted, setIsMounted] = useState(true);

  const wsJunction = findingResponse?.matrixDetail[0]?.ws_junction[0] || null;

  const initialNoteRefKanwil = useRef(findingResponse?.kanwil_response || '');

  const lastSavedNoteRefKanwil = useRef(findingResponse?.kanwil_response || "");

  const initialNoteRefKPPN = useRef(findingResponse?.kppn_response || '');

  const lastSavedNoteRefKPPN = useRef(findingResponse?.kppn_response || "");

  const {auth} = useAuth();

  const {socket} = useSocket();

  const {openSnackbar} = useSnackbar();

  const {getWsJunctionKanwil} = useWsJunction();

  const isKanwil = useMemo(() =>{
    return auth?.kppn==='03010';
  }, [auth]);

  const handleEditKanwilNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentNote = e.target.value;

    if(currentNote === lastSavedNoteRefKanwil.current) {
      return
    };
  };

  const handleEditKPPNNote = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentNote = e.target.value;

    if(currentNote === lastSavedNoteRefKanwil.current) {
      return
    };
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
          name="kppnResponse"
          size='small' 
          defaultValue={initialNoteRefKPPN.current}
          onBlur={(e) => handleEditKPPNNote(e)} 
          multiline 
          minRows={6} 
          maxRows={6}
          fullWidth
          inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false}} 
          disabled={isKanwil}
        />

        <TextField
          name="kanwilResponse" 
          size='small' 
          defaultValue={initialNoteRefKanwil.current}
          onBlur={(e) => handleEditKanwilNote(e)} 
          multiline 
          minRows={6} 
          maxRows={6}
          fullWidth
          inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false}} 
          disabled={!isKanwil}
        />
      </StyledFormControl>
    </>
    
  )
}
