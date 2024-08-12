// @mui
import { Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Iconify from '../../../../components/iconify/Iconify';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import { MatrixType, MatrixWithWsJunctionType } from '../../types';
import { WorksheetType } from '../../../worksheet/types';
import useDictionary from '../../../../hooks/useDictionary';
import useLoading from '../../../../hooks/display/useLoading';

const StyledDiv = styled('div')(({theme}) => ({
  display:'flex',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1)
}));

interface MatrixTableToolbarProps{
  matrixStatus: number | null,
  selectedKomponen: string  | null,
  setSelectedKomponen: React.Dispatch<React.SetStateAction<string | null>>,
  getMatrix: () => Promise<void>
}

export default function MatrixTableToolbar({matrixStatus, selectedKomponen, setSelectedKomponen, getMatrix}: MatrixTableToolbarProps) {
  const theme = useTheme();

  const {komponenRef} = useDictionary();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const handleReAssignMatrix = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/reAssignMatrix`, {kppnId: kppnId});
      await getMatrix();
      openSnackbar(response.data.message, "success");
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  }

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
        matrixStatus === 1 
        ? <Button variant='contained' endIcon={ <Iconify icon="solar:refresh-bold-duotone"/>} onClick={handleReAssignMatrix}>
            ReAssign Matriks
          </Button> 
        : null
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