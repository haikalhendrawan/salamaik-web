import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Tooltip, Modal} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import usePreviewFileModal from '../usePreviewFileModal';
import useStandardization from '../useStandardization';
import Label from '../../../components/label';
import Scrollbar from '../../../components/scrollbar';
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
  file: string | undefined
};

// -------------------------------------------------------------------------------------------
export default function PreviewFileModal({open, modalClose, file}: PreviewFileModalProps){
  const theme = useTheme();

  const [render, setRender] = useState<string | JSX.Element>('No files');

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {getStandardization} = useStandardization();

  const {selectedId} = usePreviewFileModal();

  const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

  const deleteFile = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post('/deleteStandardizationJunction', {
        id: selectedId,
        fileName: file
      });
      await getStandardization();
      setIsLoading(false);
      modalClose();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, 'error');
        getStandardization();
        setIsLoading(false);
      }else{
        openSnackbar('Network Error', 'error');
        getStandardization();
        setIsLoading(false);
      }
    }finally{
      setIsLoading(false);
    }
  };

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
      <div>
        <Box sx={style}>
          <embed 
            src={`${import.meta.env.VITE_API_URL}/standardization/${file}`} 
            style={{borderRadius:'12px', height:'100vh', width:'60vw'}}
          />
        </Box>
        <Tooltip title="Delete File">
            <Button 
              sx={{position: 'absolute', right:160, top:30}} 
              variant='contained'
              onClick={deleteFile}
            >
              Delete 
              <Iconify icon="solar:trash-bin-trash-bold"/>
            </Button>
          </Tooltip>
      </div>
      
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