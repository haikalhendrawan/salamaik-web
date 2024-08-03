import { useMemo } from 'react';
import { Stack, Typography, Select, MenuItem, FormControl} from '@mui/material';
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
    <MenuItem key={index+1} sx={{fontSize:12}} value={item?.value?.toString() || ''}>{item?.value}</MenuItem>
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
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Nilai KPPN :</Typography>
        <FormControl sx={{width:'100%', height:'100%'}}>
          <Select 
            required 
            name="kppnScore" 
            value={wsJunction?.kppn_score !== null ? String(wsJunction?.kppn_score) : ''}
            onChange = {(e) => handleChangeKPPNScore(e.target.value as string)}
            size='small' 
            sx={{typography:'body2', fontSize:12}}
            disabled ={isKanwil}
          >
            {opsiSelection}
            <MenuItem key={null} sx={{fontSize:12}} value={''}>{null}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Nilai Kanwil :</Typography>
        <FormControl sx={{width:'100%', height:'100%'}}>
          <Select 
            required 
            name="kanwilScore" 
            value={wsJunction?.kanwil_score !== null ? String(wsJunction?.kanwil_score) : ''} 
            onChange={(e) => handleChangeKanwilScore(e.target.value as string)}
            size='small' 
            sx={{typography:'body2', fontSize:12}}
            disabled={!isKanwil}
          >
            {opsiSelection}
            <MenuItem key={null} sx={{fontSize:12}} value={''}>{null}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      
    </Stack>    
  )
}