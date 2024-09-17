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
import {useAuth} from "../../../../hooks/useAuth";
import useSnackbar from "../../../../hooks/display/useSnackbar";
import { FindingsResponseType } from "../../types";
import useAxiosJWT from "../../../../hooks/useAxiosJWT";
// ------------------------------------------------------------
interface CatatanPropsType{
  findingResponse: FindingsResponseType | null,
  getData: () => Promise<void>,
  isDisabled: boolean
};

const StyledFormControl = styled(FormControl)(({theme}) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));

// ------------------------------------------------------------
export default function Catatan({findingResponse, getData, isDisabled}: CatatanPropsType) {
  const [isMounted, setIsMounted] = useState(true);

  const initialNoteRefKanwil = useRef(findingResponse?.kanwil_response || '');

  const lastSavedNoteRefKanwil = useRef(findingResponse?.kanwil_response || "");

  const initialNoteRefKPPN = useRef(findingResponse?.kppn_response || '');

  const lastSavedNoteRefKPPN = useRef(findingResponse?.kppn_response || "");

  const {auth} = useAuth();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const isKanwil = useMemo(() =>{
    return auth?.kppn==='03010';
  }, [auth]);

  const handleEditKanwilNote = async(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentNote = e.target.value;

    if(currentNote === lastSavedNoteRefKanwil.current) {
      return
    };

    try{
      await updateFindingResponse(currentNote, findingResponse?.kppn_response || '');
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }
  };

  const handleEditKPPNNote = async(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const currentNote = e.target.value;

    if(currentNote === lastSavedNoteRefKPPN.current) {
      return
    };

    try{
      await updateFindingResponse(findingResponse?.kanwil_response || '', currentNote);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }
  };

  const updateFindingResponse = async(kanwilNote: string, kppnNote: string) => {
    try{
      if(!findingResponse) {
        return null
      };

      const response = await axiosJWT.post("/updateFindingsResponse", {
        id: findingResponse?.id,
        kanwilResponse: kanwilNote,
        kppnResponse: kppnNote,
        userName: auth?.name,
        matrixId: findingResponse?.matrix_id
      });
      getData();
      openSnackbar(response.data.message, "success");
    }catch(err: any){
      throw err
    }
  }

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return <Box marginRight={2}> <Skeleton variant="rounded" height={'150px'} width={'100%'} /> </Box>;
  ;}

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
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
            disabled={isKanwil || isDisabled}
          />
        </StyledFormControl>
        <StyledFormControl>
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
            disabled={!isKanwil || isDisabled}
          />
        </StyledFormControl>
      </div>
    </>
    
  )
}
