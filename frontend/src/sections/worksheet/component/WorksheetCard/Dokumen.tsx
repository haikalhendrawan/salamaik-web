import { Stack, Typography, Button, Tooltip, IconButton} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Iconify from "../../../../components/iconify";
import StyledButton from "../../../../components/styledButton/StyledButton";
// ----------------------------------------------------------------------------
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

interface DokumenProps{
  modalOpen: () => void,
  openUploadFile: () => void,
  openInstruction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

// ----------------------------------------------------------------------------
export default function Dokumen({modalOpen, openUploadFile, openInstruction}: DokumenProps){
  const theme = useTheme();

  return(
    <>
      <Stack direction='column' spacing={2}>
        <Stack direction='column' spacing={1}>
          <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Petunjuk :</Typography>
          <Stack direction='row' spacing={1}>
            <Tooltip title='Instruksi'>
              <span>
                <StyledButton 
                  aria-label="instruksi" 
                  variant='contained' 
                  size='small' 
                  color='white' 
                  onClick={(e) => openInstruction(e)}
                >
                  <Iconify sx={{color:theme.palette.grey[500]}} icon="solar:info-circle-bold"/>
                </StyledButton>
              </span>
            </Tooltip>
            <Tooltip title='Contoh Bukti Dukung'>
              <span>
                <StyledButton 
                  aria-label="edit" 
                  variant='contained' 
                  size='small' 
                  color='warning'
                >
                  <Iconify icon="solar:file-bold-duotone"/>
                </StyledButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction='column' spacing={1}>
          <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Bukti Dukung :</Typography>
          <Stack direction='row' spacing={1}>
            <Tooltip title='file 1'>
              <span>
                <StyledButton 
                  aria-label="edit" 
                  variant='contained' 
                  size='small' 
                  color='secondary'
                  onClick={modalOpen}
                >
                  <Iconify icon="solar:file-bold-duotone"/>
                </StyledButton>
              </span>
            </Tooltip>

            <Tooltip title='file 2'>
              <span>
                <StyledButton 
                  aria-label="edit" 
                  variant='contained' 
                  size='small' 
                  color='secondary'
                  onClick={modalOpen}
                >
                  <Iconify icon="solar:file-bold-duotone"/>
                </StyledButton>
              </span>
            </Tooltip>

            <Tooltip title='Add file'>
              <StyledButton variant='contained' component='label' aria-label="delete"   size='small' color='white'>
                <Iconify 
                  sx={{color:theme.palette.grey[500]}} 
                  icon="solar:add-circle-bold"
                />
                <VisuallyHiddenInput 
                  type='file'
                  accept='image/*,.pdf,.zip' 
                  onChange={(e) => console.log(e)} 
                />
              </StyledButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>   
    </>
  )
}