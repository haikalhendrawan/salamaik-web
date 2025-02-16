/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Skeleton  from "@mui/material/Skeleton";
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { WsJunctionType, WorksheetType } from "../../types";
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
export default function Catatan({wsJunction}: CatatanPropsType) {
  const [isMounted, setIsMounted] = useState(true);

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
          value={wsJunction?.kanwil_note || ''}
          multiline 
          minRows={6} 
          maxRows={6}
          fullWidth
          inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false}} 
          disabled
        />
      </StyledFormControl>
    </>
    
  )
}
