import {IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';


const Checklist = (props: any) => (<Iconify icon={props.icon} sx={{cursor: 'pointer', color: props.color}} />);

export default function CheckButton(){
  const theme = useTheme();

  return(
    <>
      <IconButton 
        component="label"
      >
        <Iconify 
          sx={{color:theme.palette.success.dark}} 
          icon='solar:check-circle-bold'
        />
      </IconButton>
      {/* <Checklist color={theme.palette.success.dark} icon='solar:check-circle-bold'/> */}
    </>
  )
}