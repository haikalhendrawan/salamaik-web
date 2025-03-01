/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {IconButton} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import Iconify from '../../../../components/iconify/Iconify';

interface AddButtonProps{
  kppn: string,
  standardizationId: number,
  month: number
};

export default function AddButton({}: AddButtonProps){
  const theme = useTheme();

  return(
    <>
      <IconButton 
        component="label"
        disabled
      >
        <Iconify 
          sx={{color:theme.palette.grey[500]}} 
          icon="solar:add-circle-bold"
        />
      </IconButton>


    </>
  )
}