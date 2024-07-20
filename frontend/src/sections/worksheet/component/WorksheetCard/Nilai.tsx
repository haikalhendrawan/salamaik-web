import {useState, useRef} from "react";
import { Stack, Typography, Grid, Card, CardHeader, Select, MenuItem,
  FormControl, TextField, Grow, Divider} from '@mui/material';
// ------------------------------------------------------------

// ------------------------------------------------------------
export default function Nilai() {
  const [selectValue, setSelectValue] = useState<number>(0);

  const [selectValue2, setSelectValue2] = useState<number>(1);

  return (
    <Stack direction='column' spacing={2}>
      <Stack direction='column' spacing={1} >
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Nilai KPPN :</Typography>
        <FormControl sx={{width:'100%', height:'100%'}}>
          <Select 
            required 
            name="kondisi" 
            disabled
            value={selectValue2}  
            size='small' 
            sx={{typography:'body2', fontSize:12,}}
          >
            <MenuItem key={0} sx={{fontSize:12}} value={0}>10</MenuItem>
            <MenuItem key={1} sx={{fontSize:12}} value={1}>5</MenuItem>
            <MenuItem key={2} sx={{fontSize:12}} value={2}>0</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Nilai Kanwil :</Typography>
        <FormControl sx={{width:'100%', height:'100%'}}>
          <Select 
            required 
            name="kondisi" 
            value={selectValue2}  
            size='small' 
            sx={{typography:'body2', fontSize:12}}
          >
            <MenuItem key={0} sx={{fontSize:12}} value={0}>10</MenuItem>
            <MenuItem key={1} sx={{fontSize:12}} value={1}>5</MenuItem>
            <MenuItem key={2} sx={{fontSize:12}} value={2}>0</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      
    </Stack>    
  )
}