import { Stack, Typography, Tooltip} from '@mui/material';
import Label from '../../../../components/label/Label';
import StyledButton from '../../../../components/styledButton/StyledButton';
import Iconify from '../../../../components/iconify/Iconify';

export default function Approval() {
  return (
    <Stack direction='column' spacing={3}>
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Status :</Typography>
          <Stack direction='row' spacing={1}>
            <Label color='success'> Approved</Label>
          </Stack>
      </Stack>
      
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Action :</Typography>
        <Stack direction='row' spacing={1}>
          <Tooltip title='Approve'>
            <span>
              <StyledButton 
                aria-label="instruksi" 
                variant='contained' 
                size='small' 
                color='success' 
              >
                <Iconify icon="solar:check-circle-bold-duotone"/>
              </StyledButton>
            </span>
          </Tooltip>
          <Tooltip title='Tolak'>
            <span>
              <StyledButton 
                aria-label="edit" 
                variant='contained' 
                size='small' 
                color='error'
              >
                <Iconify icon="solar:close-circle-bold"/>
              </StyledButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      
    </Stack>   
  )
}
