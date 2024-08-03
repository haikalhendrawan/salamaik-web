import {useState, useEffect} from'react';
import {Button, Box, Tooltip, Modal, Typography} from '@mui/material';
import Iconify from '../../../components/iconify';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import usePreviewFileModal from '../usePreviewFileModal';
import useSocket from '../../../hooks/useSocket';
import useWsJunction from '../useWsJunction';
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
export default function PreviewFileModal(){
  const {
    open, 
    file, 
    selectedId, 
    fileOption,
    isExampleFile, 
    modalClose, 
  } = usePreviewFileModal();

  const [render, setRender] = useState<string | JSX.Element>('No files');

  const {setIsLoading} = useLoading();

  const {socket} = useSocket();

  const {openSnackbar} = useSnackbar();

  const {getWsJunctionKanwil} = useWsJunction();

  const currentFileURL = `${import.meta.env.VITE_API_URL}/standardization`;

  const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

  const handleDownload = () => {
    window.location.href=`${currentFileURL}/${file}`;
  };

  const deleteFile = () => {
      if(isExampleFile){
        return
      };

      socket?.emit("deleteWsJunctionFile", {
        id: selectedId,
        fileName: file,
        option: fileOption,
      }, async(response: any) => {
        try{
          setIsLoading(true);
          await getWsJunctionKanwil('010');
          modalClose();
          setIsLoading(false);
        }catch(err: any){
          setIsLoading(false);
          openSnackbar(err.response.data.message, "error");
        }finally{
          setIsLoading(false);
        }
      });


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
        <Tooltip title="Delete File">
            <Button 
              sx={{position: 'absolute', right:160, top:30, display: isExampleFile ? 'none' : 'block'}} 
              variant='contained'
              color='pink'
              onClick={deleteFile}
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