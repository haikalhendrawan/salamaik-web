// @mui
import { Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';

const StyledDiv = styled('div')(({theme}) => ({
  display:'flex',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1)
}));

export default function MatrixTableToolbar(){
  const theme = useTheme();
  
  return(
    <StyledDiv>
      <FormControl sx={{height:'45px', width:'30%'}}>
        <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
        <Select 
          name="komponen" 
          label='Komponen'
          labelId="komponen-select-label"
          value= {1}
          sx={{typography:'body2', fontSize:14, height:'100%'}}
        >
          <MenuItem key={0} sx={{fontSize:14}} value={0}>Treasurer</MenuItem>
          <MenuItem key={1} sx={{fontSize:14}} value={1}>Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission</MenuItem>
          <MenuItem key={2} sx={{fontSize:14}} value={2}>Financial Advisor</MenuItem>
          <MenuItem key={3} sx={{fontSize:14}} value={3}>Tata Kelola Internal</MenuItem>
        </Select>
      </FormControl>
      <Button variant='contained' endIcon={ <Iconify icon="solar:refresh-bold-duotone"/>}>Update Matriks</Button>
      <div style={{flexGrow:1}} />
      <Button variant="text"  endIcon={ <Iconify icon="vscode-icons:file-type-pdf2"/>}>
        Export
      </Button>
      <Button variant="text"  endIcon={ <Iconify icon="vscode-icons:file-type-excel"/>}>
        Export
      </Button>
      <Button variant="text"  endIcon={ <Iconify icon="vscode-icons:file-type-powerpoint"/>}>
        Export
      </Button>
    </StyledDiv>
  )
}