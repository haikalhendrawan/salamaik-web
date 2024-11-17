/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Button, Box, Modal, Typography} from '@mui/material';
import Iconify from '../../../../components/iconify';
import usePreviewFileModal from '../usePreviewFileModal';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  left: '20%',
  width: '60%',
  boxShadow: 24,
  borderRadius:'12px',
  justifyContent: 'center', alignItems: 'center', height: '100vh'
};

// -------------------------------------------------------------------------------------------
export default function PreviewFileModal() {
  const {
    open, 
    file, 
    modalClose, 
  } = usePreviewFileModal();

  const [render, setRender] = useState<string | JSX.Element>('No files');

  const currentFileURL = `${import.meta.env.VITE_API_URL}/`;

  const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

  const handleDownload = () => {
    window.location.href=`${currentFileURL}/${file}`;
  };

  useEffect(() => {
    if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png' || fileExt==='pdf'){
      setRender(
       <embed src={`${import.meta.env.VITE_API_URL}/${file}`} style={{borderRadius:'12px', height:'100vh', width:'60vw'}} />
      )
    }else if(fileExt==='zip' || fileExt==='rar' ){
      setRender(
         <Button 
            variant="contained" 
            sx={{position:'absolute', left:'40%', top:'50%'}} 
            onClick={handleDownload}
            endIcon={<Iconify icon="solar:download-bold"/>}
          >
            Download Zip File
          </Button>
      )
    }else{
      setRender(<Typography> Unknown file type </Typography>)
    }
  },[file]);


  // ----------------------------------------------------------------------------------------
  return(
    <>
    <Modal open={open} onClose={modalClose} keepMounted>
      <div>
        <Box sx={style}>
          {render}
        </Box>
      </div>
    </Modal>

    </>
  )
}