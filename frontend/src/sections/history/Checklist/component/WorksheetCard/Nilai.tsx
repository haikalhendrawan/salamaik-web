/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useMemo, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Skeleton  from "@mui/material/Skeleton";
import { TextField } from '@mui/material';
import styled  from '@mui/material/styles/styled';
import { WorksheetType, WsJunctionType } from "../../types";
// import {useAuth} from "../../../../../hooks/useAuth";
// ------------------------------------------------------------
interface NilaiPropsType{
  wsJunction: WsJunctionType | null,
  wsDetail: WorksheetType | null,
  isExcluded: boolean
};

const StyledFormControl = styled(FormControl)(({}) => ({
  width: '100%',
  height: '100%'
}));

const StyledSelect = styled(Select)(({}) => ({
  fontSize: 12,
  typography:'body2'
}));

const StyledMenuItem = styled(MenuItem)(({}) => ({
  fontSize: 12,
}));

const StyledNumberTextField = styled(TextField)(({}) => ({
  typography:'body2',
  '& .MuiInputBase-input': {
    fontSize: 12,
    height:'1.4375em',
    borderRadius:'12px',
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px"
  },
  "& .MuiInputLabel-shrink": {
    fontSize: '1rem',
    fontWeight: 600,
  },
  width:'50%',
}));

// ------------------------------------------------------------
export default function Nilai({wsJunction, isExcluded}: NilaiPropsType) {
  const [isMounted, setIsMounted] = useState(true);

  const [stdScoreKanwil, _setStdScoreKanwil] = useState(wsJunction?.kanwil_score || '');
  
  const [stdScoreKPPN, _setStdScoreKPPN] = useState(wsJunction?.kppn_score || '');

  // const { auth } = useAuth();

  // const isPastDue = useMemo(() => new Date().getTime() > new Date(wsDetail?.close_period || "").getTime(), [wsDetail]);

  // const isKanwil = useMemo(() =>{
  //   return auth?.kppn==='03010';
  // }, [auth]);

  const opsiSelection = useMemo(() => wsJunction?.opsi?.map((item, index) => (
    <StyledMenuItem key={index+1} value={item?.value?.toString() || ''}>{item?.value}</StyledMenuItem>
  )), [wsJunction]);

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return (
      <>
        <br/>
        <Skeleton variant="rounded" height={'1.4375em'} width={'100%'} />
        <br/>
        <br/>
        <Skeleton variant="rounded" height={'1.4375em'} width={'100%'} />
      </>
    );
  };

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='column' spacing={1} display={isExcluded ? 'none' : 'flex'}>
        <Typography variant='body3' fontSize={12} textAlign={'left'}>Nilai KPPN :</Typography>
        <StyledFormControl>
          {
            wsJunction?.standardisasi === 1
            ?
              <Stack direction='row' spacing={2}>
                <StyledNumberTextField  
                  size='small'
                  type="text"
                  disabled
                  value={stdScoreKPPN}
                />
              </Stack>
            :
              <StyledSelect
                required 
                name="kppnScore" 
                value={wsJunction?.kppn_score !== null ? String(wsJunction?.kppn_score) : ''}
                size='small' 
                disabled
              >
                {opsiSelection}
                <StyledMenuItem key={null} value={''}>{null}</StyledMenuItem>
              </StyledSelect>
          }
        </StyledFormControl>
      </Stack>
      
      <Stack direction='column' spacing={1} display={isExcluded ? 'none' : 'flex'}>
        <Typography variant='body3' fontSize={12} textAlign={'left'}>Nilai Kanwil :</Typography>
        <StyledFormControl>
          {
            wsJunction?.standardisasi === 1
            ?
              <Stack direction='row' spacing={2}>
                <StyledNumberTextField  
                  size='small'
                  type="text"
                  disabled
                  value={stdScoreKanwil}
                />
              </Stack>
            :
              <StyledSelect 
                required 
                name="kanwilScore" 
                value={wsJunction?.kanwil_score !== null ? String(wsJunction?.kanwil_score) : ''} 
                size='small' 
                disabled
              >
                {opsiSelection}
                <StyledMenuItem key={null} value={''}>{null}</StyledMenuItem>
              </StyledSelect>
          }
        </StyledFormControl>
      </Stack>
    </Stack>    
  );
}
