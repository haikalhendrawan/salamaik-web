import {useState, useRef} from "react";
import { FormControl, TextField} from '@mui/material';

export default function Catatan() {

  const [value, setValue] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value)
  };
  return (
    <>
      <FormControl sx={{width:'100%', height:'100%', pr:1, pt:0.5}}>
        <TextField 
          name="catatankppn" 
          size='small' 
          value={value} 
          onChange={handleChange} 
          multiline 
          minRows={6} 
          maxRows={6}
          sx={{width:'100%', height:'100%'}}  
          inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false,}} 
        />
      </FormControl>
    </>
    
  )
}
