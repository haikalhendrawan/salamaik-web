import {useState, useEffect} from "react";
import { Stack, Typography, Select, MenuItem, FormControl} from '@mui/material';
import { WsJunctionType } from "../../types";
import useSocket from "../../../../hooks/useSocket";
import useWsJunction from "../../useWsJunction";
import {useAuth} from "../../../../hooks/useAuth";
// ------------------------------------------------------------
interface NilaiPropsType{
  wsJunction: WsJunctionType | null,
}
// ------------------------------------------------------------
export default function Nilai({wsJunction}: NilaiPropsType) {
  const {socket} = useSocket();

  const { auth } = useAuth();

  const {getWsJunctionKanwil} = useWsJunction();

  const opsiSelection = wsJunction?.opsi?.map((item, index) => (
    <MenuItem key={index} sx={{fontSize:12}} value={item?.value?.toString() || ''}>{item?.value}</MenuItem>
  ) || null);

  const handleChangeKanwilScore = (newScore: string) => {
    const score = parseInt(newScore);

    socket?.emit("updateKanwilScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kanwilScore: score,
      userName: auth?.name
    },
    (response: any) => {
      console.log(response.success);
      getWsJunctionKanwil(wsJunction?.kppn_id || '');
    });
  };

  const handleChangeKPPNScore = (newScore: string) => {
    const score = parseInt(newScore);

    socket?.emit("updateKPPNScore", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      kppnScore: score,
      userName: auth?.name
    },
    (response: any) => {
      console.log(response);
      getWsJunctionKanwil(wsJunction?.kppn_id || '');
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
            defaultValue={wsJunction?.kppn_score} 
            onChange = {(e) => handleChangeKPPNScore(e.target.value as string)}
            size='small' 
            sx={{typography:'body2', fontSize:12,}}
          >
            {opsiSelection}
          </Select>
        </FormControl>
      </Stack>
      
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Nilai Kanwil :</Typography>
        <FormControl sx={{width:'100%', height:'100%'}}>
          <Select 
            required 
            name="kanwilScore" 
            defaultValue={wsJunction?.kanwil_score}  
            onChange={(e) => handleChangeKanwilScore(e.target.value as string)}
            size='small' 
            sx={{typography:'body2', fontSize:12}}
          >
            {opsiSelection}
          </Select>
        </FormControl>
      </Stack>
      
    </Stack>    
  )
}