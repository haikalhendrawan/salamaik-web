import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Paper, Modal} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useChecklist from './useChecklist';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  left: '20%',
  height:'100%',
  width: '60%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  pt: 1,
  pr:0,
  pb: 2,
  borderRadius:'12px',
};


interface ChecklistFileModalProps {
  open: boolean,
  modalClose: () => void,
  fileName: string | null,
  editID: number | null,
  fileOption: 1 | 2 
};


//----------------------------------------------------------------
export default function ChecklistFileModal({
  open, 
  modalClose, 
  fileName, 
  editID, 
  fileOption}: ChecklistFileModalProps) {

  const theme = useTheme();

  const {getChecklist} = useChecklist();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const [render, setRender] = useState<string | JSX.Element>('No files');

  const currentFileURL = `http://localhost:8080/checklist`;

  const fileExt = fileName?fileName.split('.').pop()?.toLowerCase() : '' ;

  const handleDelete = async() => {
    try{
      const response = await axiosJWT.post('/deleteChecklistFile', {
        id: editID, 
        filename: fileName, 
        option: fileOption});
      modalClose();
      getChecklist();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, 'error');
      }else{
        openSnackbar('Network Error', 'error');
      }

    }
  }

  useEffect(() => {
    if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png'){
      setRender(
        <img 
          alt="file name doesn't correspond with database"
          src={`${currentFileURL}/${fileName}`} 
          style={{borderRadius:'12px', paddingRight:theme.spacing(4)}}
        />
      )
      console.log('jpg')
    }else if(fileExt==='pdf'){
      setRender(
        <embed 
          src={`${currentFileURL}/${fileName}`} 
          width="100%" 
          height="90%"
          style={{borderRadius:'12px', paddingRight:theme.spacing(4)}}
        />
      )
      console.log('pdf')
    }else if(fileExt==='zip' || fileExt==='rar' ){
      setRender(
        <Button 
          variant="contained" 
          sx={{position:'absolute', left:'45%', top:'50%'}}
        >
          Download File
        </Button>
      )
    }else{
      setRender('Unknown file type')
    }
  },[fileName]);
  

  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal open={open} onClose={modalClose}>
          <Box sx={style}>
            <Scrollbar>
              <Paper sx={{height:'100vh', width:'auto'}}>
                <Stack direction={'row'} sx={{mb:1, pr:4}}>
                  <Box sx={{flexGrow:1}} />
                  <Button 
                    variant='contained' 
                    color='pink'
                    onClick={handleDelete}
                  > 
                    Delete File 
                  </Button>
                </Stack>
                {render}
              </Paper>
            </Scrollbar>
          </Box>
      </Modal>
      
      </>
  )
}