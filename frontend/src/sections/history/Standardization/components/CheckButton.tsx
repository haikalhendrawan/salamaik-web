/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {IconButton} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import Iconify from '../../../../components/iconify/Iconify';
import usePreviewFileModal from '../usePreviewFileModal';

interface CheckButtonProps{
  file: string,
  id: number
}

export default function CheckButton({file, id}: CheckButtonProps) {
  const theme = useTheme();

  const {modalOpen, changeFile, selectId} = usePreviewFileModal();

  return(
    <>
      <IconButton 
        component="label"
        onClick={() => {
          modalOpen(); 
          changeFile(file);
          selectId(id);
        }}
      >
        <Iconify 
          sx={{color:theme.palette.success.dark}} 
          icon='solar:check-circle-bold'
        />
      </IconButton>
    </>
  )
}