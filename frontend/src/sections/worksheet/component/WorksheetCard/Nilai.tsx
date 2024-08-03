import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import styled  from '@mui/material/styles/styled';
import { WsJunctionType } from "../../types";
import useSocket from "../../../../hooks/useSocket";
import useWsJunction from "../../useWsJunction";
import {useAuth} from "../../../../hooks/useAuth";
import useLoading from "../../../../hooks/display/useLoading";
import useSnackbar from "../../../../hooks/display/useSnackbar";
// ------------------------------------------------------------
interface NilaiPropsType{
  wsJunction: WsJunctionType | null,
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
}))
// ------------------------------------------------------------
export default function Nilai({wsJunction}: NilaiPropsType) {
  const {socket} = useSocket();

  const { auth } = useAuth();

  const {setIsLoading} = useLoading();

  const {getWsJunctionKanwil} = useWsJunction();

  const {openSnackbar} = useSnackbar();

  const isKanwil = useMemo(() =>{
    return auth?.kppn==='03010';
  }, [auth])

  const opsiSelection = wsJunction?.opsi?.map((item, index) => (
    <StyledMenuItem key={index+1} value={item?.value?.toString() || ''}>{item?.value}</StyledMenuItem>
  ) || null);

  const handleChangeKanwilScore = (newScore: string) => {
    setIsLoading(true);
    const score = parseInt(newScore);

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKanwilScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kanwilScore: score,
      userName: auth?.name
    }, async(response: any) => {
      try{
        console.log(response.success);
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        setIsLoading(false);
      }catch(err: any){
        openSnackbar(err?.message, 'error');
      }

    });
  };

  const handleChangeKPPNScore = (newScore: string) => {
    setIsLoading(true);
    const score = parseInt(newScore);

    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateKPPNScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kppnScore: score,
      userName: auth?.name
    }, async (response: any) => {
      try{
        console.log(response);
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        setIsLoading(false);
      }catch(err: any){
        openSnackbar(err?.message, 'error');
      }

    });

  };


  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='column' spacing={1} >
        <Typography variant='body3' fontSize={12} textAlign={'left'}>Nilai KPPN :</Typography>
        <StyledFormControl>
          <StyledSelect
            required 
            name="kppnScore" 
            value={wsJunction?.kppn_score !== null ? String(wsJunction?.kppn_score) : ''}
            onChange = {(e) => handleChangeKPPNScore(e.target.value as string)}
            size='small' 
            disabled ={isKanwil}
          >
            {opsiSelection}
            <StyledMenuItem key={null} value={''}>{null}</StyledMenuItem>
          </StyledSelect>
        </StyledFormControl>
      </Stack>
      
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' fontSize={12} textAlign={'left'}>Nilai Kanwil :</Typography>
        <StyledFormControl>
          <StyledSelect 
            required 
            name="kanwilScore" 
            value={wsJunction?.kanwil_score !== null ? String(wsJunction?.kanwil_score) : ''} 
            onChange={(e) => handleChangeKanwilScore(e.target.value as string)}
            size='small' 
            disabled={!isKanwil}
          >
            {opsiSelection}
            <StyledMenuItem key={null} value={''}>{null}</StyledMenuItem>
          </StyledSelect>
        </StyledFormControl>
      </Stack>
      
    </Stack>    
  )
}