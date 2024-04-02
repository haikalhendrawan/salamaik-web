import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Paper, Modal} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
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
  file: string | undefined
};


//----------------------------------------------------------------
export default function ChecklistFileModal({open, modalClose, file}: ChecklistFileModalProps) {
  const theme = useTheme();

  const [render, setRender] = useState<string | JSX.Element>('No files');

  const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

  // useEffect(() => {
  //   if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png'){
  //     setRender(
  //       <img alt="file name doesn't correspond with database" style={{width:'100%', height:'100%'}}/>
  //     )
  //     console.log('jpg')
  //   }else if(fileExt==='pdf'){
  //     setRender(
  //       <embed src={`file`} width="100%" height="100%" />
  //     )
  //     console.log('pdf')
  //   }else if(fileExt==='zip' || fileExt==='rar' ){
  //     setRender(
  //       <Button variant="contained" sx={{position:'absolute', left:'45%', top:'50%'}}>
  //         Download File
  //       </Button>
  //     )
  //   }else{
  //     setRender('Unknown file type')
  //   }
  // },[file]);
  

  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal open={open} onClose={modalClose}>
          <Box sx={style}>
            <Scrollbar>
              <Paper sx={{height:'100vh', width:'auto'}}>
                <Stack direction={'row'} sx={{mb:1, pr:4}}>
                  <Box sx={{flexGrow:1}} />
                  <Button variant='contained' color='pink'> Delete File </Button>
                </Stack>
                <embed src={file} width="100%" height="90%" style={{borderRadius:'12px', paddingRight:theme.spacing(4)}}/>
              </Paper>
            </Scrollbar>
          </Box>


        {/* if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png'){
          setRender(
            <img alt="file name doesn't correspond with database" src={`${currentFileURL}/${currentFile}`} style={{width:'100%', height:'100%'}}/>
          )
          console.log('jpg')
        }else if(fileExt==='pdf'){
          setRender(
            <embed src={`${currentFileURL}/${currentFile}`} width="100%" height="100%" />
          )
          console.log('pdf')
        }else if(fileExt==='zip' || fileExt==='rar' ){
          setRender(
            <Button variant="contained" target='blank' onClick={handleDownload} sx={{position:'absolute', left:'45%', top:'50%'}}>
              Download File
            </Button>
          )
        }else{
          setRender('Unknown file type')
        } */}
      </Modal>
      
      </>
  )
}