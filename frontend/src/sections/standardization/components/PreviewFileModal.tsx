import {useState, useEffect} from'react';
import {Button, Box, Tooltip, Modal, Typography} from '@mui/material';
import Iconify from '../../../components/iconify';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import usePreviewFileModal from '../usePreviewFileModal';
import useStandardization from '../useStandardization';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  left: '20%',
  width: '60%',
  boxShadow: 24,
  borderRadius:'12px',
  justifyContent: 'center', alignItems: 'center', height: '100vh'
};

interface PreviewFileModalProps {
  open: boolean,
  modalClose: () => void,
  file: string | undefined,
  kppnId: string
};

// -------------------------------------------------------------------------------------------
export default function PreviewFileModal({open, modalClose, file, kppnId}: PreviewFileModalProps){
  const [render, setRender] = useState<string | JSX.Element>('No files');

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {getStandardization} = useStandardization();

  const {selectedId} = usePreviewFileModal();

  const currentFileURL = `${import.meta.env.VITE_API_URL}/standardization`;

  const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

  const handleDownload = () => {
    window.location.href=`${currentFileURL}/${file}`;
  };

  const deleteFile = async() => {
    try{
      setIsLoading(true);
      await axiosJWT.post('/deleteStandardizationJunction', {
        id: selectedId,
        fileName: file
      });
      await getStandardization(kppnId);
      setIsLoading(false);
      modalClose();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, 'error');
        getStandardization(kppnId);
        setIsLoading(false);
      }else{
        openSnackbar('Network Error', 'error');
        getStandardization(kppnId);
        setIsLoading(false);
      }
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png' || fileExt==='pdf'){
      setRender(
       <embed src={`${import.meta.env.VITE_API_URL}/standardization/${file}`} style={{borderRadius:'12px', height:'100vh', width:'60vw'}} />
      )
    }else if(fileExt==='zip' || fileExt==='rar' ){
      setRender(
         <Button 
            variant="contained" 
            sx={{position:'absolute', left:'45%', top:'50%'}} 
            onClick={handleDownload}
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
              sx={{position: 'absolute', right:160, top:30}} 
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