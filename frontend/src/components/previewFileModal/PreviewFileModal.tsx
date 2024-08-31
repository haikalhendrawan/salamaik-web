import { Box,  Modal} from '@mui/material';
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
  // const theme = useTheme();

  // const [render, setRender] = useState<string | JSX.Element>('No files');

  // const fileExt = file ? file.split('.').pop()?.toLowerCase() : '' ;

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
        <embed src={file} width="98%" style={{borderRadius:'12px', height:'100vh', width:'60vw'}}/>
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