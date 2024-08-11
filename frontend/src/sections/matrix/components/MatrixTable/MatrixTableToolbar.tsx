// @mui
import { Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Iconify from '../../../../components/iconify/Iconify';
import useDictionary from '../../../../hooks/useDictionary';

const StyledDiv = styled('div')(({theme}) => ({
  display:'flex',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1)
}));

interface MatrixTableToolbarProps{
  matrixStatus: number | null,
  selectedKomponen: string  | null,
  setSelectedKomponen: React.Dispatch<React.SetStateAction<string | null>>,
}

export default function MatrixTableToolbar({matrixStatus, selectedKomponen, setSelectedKomponen}: MatrixTableToolbarProps) {
  const theme = useTheme();

  const {komponenRef} = useDictionary();

  return(
    <StyledDiv>
      <FormControl sx={{height:'45px', width:'30%'}}>
        <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
        <Select 
          name="komponen" 
          label='Komponen'
          labelId="komponen-select-label"
          onChange={(e) => setSelectedKomponen(e.target.value)}
          value= {selectedKomponen}
          sx={{typography:'body2', fontSize:14, height:'100%'}}
        >
          {
            komponenRef?.map((item) => (
              <MenuItem key={item?.id} sx={{fontSize:14}} value={item?.id}>{item?.title}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      {
        matrixStatus === 1 ?<Button variant='contained' endIcon={ <Iconify icon="solar:refresh-bold-duotone"/>}>Update Matriks</Button> : null
      }
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