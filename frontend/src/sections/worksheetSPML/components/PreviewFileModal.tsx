/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useCallback, useState, useEffect} from'react';
import {Button, Box, Tooltip, Modal, Typography} from '@mui/material';
import Iconify from '../../../components/iconify';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import usePreviewFileModal from '../usePreviewFileModal';
import useSocket from '../../../hooks/useSocket';
import useWsSPMLJunction from '../useWsSPMLJunction';
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
export default function PreviewFileModal({isDisabled, kppn}: {isDisabled: boolean, kppn: string | null}) {
  const {
    open, 
    file, 
    selectedId, 
    isExampleFile, 
    modalClose, 
  } = usePreviewFileModal();

  const [render, setRender] = useState<string | JSX.Element>('No files');

  const {setIsLoading} = useLoading();

  const {socket} = useSocket();

  const {openSnackbar} = useSnackbar();

  const {getWsSPMLJunctionKanwil} = useWsSPMLJunction();

  const currentFileURL = import.meta.env.VITE_API_URL;

  const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

  const handleDownload = useCallback(() => {
    window.location.href = `${currentFileURL}/${file}`;
  }, [currentFileURL, file]);

  const deleteFile = () => {
      if(isExampleFile){
        return
      }

      if (!socket?.connected) {
        openSnackbar("websocket failed, check your connection", "error");
        return;
      }

      setIsLoading(true);
      socket.emit("deleteWsSPMLJunctionFile", {
        junctionId: selectedId,
        fileName: file,
      }, async(response: {success: boolean; message: string}) => {
        try{
          if (!response?.success) {
            openSnackbar(response?.message || "Gagal menghapus file SPML", "error");
            return;
          }
          await getWsSPMLJunctionKanwil(kppn || '');
          modalClose();
          openSnackbar(response.message || "File SPML berhasil dihapus", "success");
        }catch(err: unknown){
          openSnackbar(err instanceof Error ? err.message : "Gagal menghapus file SPML", "error");
        }finally{
          setIsLoading(false);
        }
      });


  };

  useEffect(() => {
    if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png' || fileExt==='pdf'){
      setRender(
       <embed src={`${currentFileURL}/${file}`} style={{borderRadius:'12px', height:'100vh', width:'60vw'}} />
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
  },[currentFileURL, file, fileExt, handleDownload]);


  // ----------------------------------------------------------------------------------------
  return(
    <>
    <Modal open={open} onClose={modalClose} keepMounted>
      <div>
        <Box sx={style}>
          {render}
        </Box>
        <Tooltip title="Delete File">
            <Button 
              sx={{position: 'absolute', right:160, top:30, display: isExampleFile ? 'none' : 'block'}} 
              variant='contained'
              color='pink'
              onClick={deleteFile}
              disabled={isDisabled}
            >
              Delete 
              <Iconify icon="solar:trash-bin-trash-bold"/>
            </Button>
          </Tooltip>
      </div>
    </Modal>

    </>
  )
}
