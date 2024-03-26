import { Stack, Typography, Box, FormControl,  Grid, IconButton, Card, TextField, Button, Slide, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../iconify/Iconify';


// ----------------------------------------------------------------
const ImageBox = styled(Box)(({ theme }) => ({
  borderRadius:'50%', 
  height:'144px', 
  width:'144px', 
  p:'8px', 
  border:'1px dashed rgba(145, 158, 171, 0.2)',
  position: 'relative', 
  '&:hover .MuiTypography-root': { 
    color: 'white' 
  },
  '&:hover .MuiBox-root': { 
    color: 'white' 
  },
  '&:hover .backdrop': { 
    opacity: 0.5
  }
}));

const ImageButton = styled(IconButton)(({theme}) => ({
  width:'100%', 
  height:'100%', 
  mx:'auto',
  cursor: 'pointer', 
  p:0, 
  backgroundSize: 'cover', 
}));

const ImageBackdrop = styled(Box)(({theme}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  opacity: 0, 
  borderRadius: '50%', 
  zIndex: 0, 
  transition: 'opacity 0.3s ease'
}));

const BackdropTypography = styled(Typography)(({theme}) => ({
  color: 'transparent', 
  position: 'absolute', 
  top: '60%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  transition: 'color 0.3s ease', 
  pointerEvents: 'none',
  zIndex: 1
}));

const BackdropIcon = styled(Iconify)(({theme}) => ({
  color: 'transparent', 
  position: 'absolute', 
  top: '45%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  transition: 'color 0.3s ease', 
  pointerEvents: 'none',
  zIndex: 1
}));

// ---------------------------------------------------------------------
interface ProfilePicUploadProps{
  onClick?:() => void,
  imageUrl?:string
}

// --------------------------------------------------------------------
export default function ProfilePicUpload({onClick, imageUrl}: ProfilePicUploadProps){
  return(
    <>
      <ImageBox>
        <ImageButton onClick={onClick} sx={{ backgroundImage: `url('${imageUrl}')` }}>
          <ImageBackdrop className="backdrop" />
          <BackdropTypography variant="body2">Upload</BackdropTypography>
          <BackdropIcon icon={"solar:camera-bold"} />
        </ImageButton>
      </ImageBox>
    </>
  )
}