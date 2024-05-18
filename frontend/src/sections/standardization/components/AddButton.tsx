import {IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';


const Checklist = (props: any) => (<Iconify icon={props.icon} sx={{cursor: 'pointer', color: props.color}} />);

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function AddButton(){
  const theme = useTheme();

  return(
    <>
      <IconButton 
        component="label"
      >
        <Iconify 
          sx={{color:theme.palette.grey[500]}} 
          icon="solar:add-circle-bold"
        />
        <VisuallyHiddenInput 
        type='file'
        accept='image/*,.pdf,.zip' 
        />
      </IconButton>

      {/* <Checklist color={theme.palette.grey[500]} icon='solar:add-circle-bold'/> */}
    </>
  )
}