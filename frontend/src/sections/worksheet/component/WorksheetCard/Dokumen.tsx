import { useCallback } from 'react';
import { Stack, Typography, Tooltip} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import usePreviewFileModal from '../../usePreviewFileModal';
import Iconify from "../../../../components/iconify";
import StyledButton from "../../../../components/styledButton/StyledButton";
import { useAuth } from '../../../../hooks/useAuth';
import { WsJunctionType } from '../../types';
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
  openInstruction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  wsJunction: WsJunctionType | null
}

// ----------------------------------------------------------------------------
export default function Dokumen({openInstruction, wsJunction}: DokumenProps){
  const theme = useTheme();

  const {auth} = useAuth();

  const {open, file, selectedId, fileOption, handleSetIsExampleFile, modalOpen, modalClose, changeFile, selectId } = usePreviewFileModal();

  const handleOpenExampleFile = useCallback((option: number) => {
    const baseDir = "checklist";
    const fileOption = option===1?wsJunction?.file1:wsJunction?.file2;
    modalOpen();
    changeFile(baseDir+ '/' + fileOption || '');
    handleSetIsExampleFile(true);
  }, [modalOpen]);

  const handleOpenWsJunctionFile = useCallback((option: number, id: number) => {
    const baseDir = "worksheet";
    const fileOption = [wsJunction?.file_1, wsJunction?.file_2, wsJunction?.file_3][option-1];
    modalOpen();
    changeFile(baseDir+ '/' + fileOption || '');
    handleSetIsExampleFile(false);
    selectId(wsJunction?.junction_id || 0);
  }, [modalOpen]);

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
            {
              wsJunction?.file1
              ?
                <Tooltip title='Contoh Bukti Dukung 1'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='warning'
                      onClick={() => handleOpenExampleFile(1)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              wsJunction?.file2
              ?
                <Tooltip title='Contoh Bukti Dukung 2'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='warning'
                      onClick={() => handleOpenExampleFile(2)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            } 
          </Stack>
        </Stack>

        <Stack direction='column' spacing={1}>
          <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Bukti Dukung :</Typography>
          <Stack direction='row' spacing={1}>
            {
              wsJunction?.file_1
              ?
                <Tooltip title='file 1'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='secondary'
                      onClick={() => handleOpenWsJunctionFile(1, wsJunction?.junction_id || 0)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              wsJunction?.file_2
              ?
                <Tooltip title='file 2'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='secondary'
                      onClick={() => handleOpenWsJunctionFile(2, wsJunction?.junction_id || 0)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              wsJunction?.file_3
              ?
                <Tooltip title='file 3'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='secondary'
                      onClick={() => handleOpenWsJunctionFile(3, wsJunction?.junction_id || 0)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            <Tooltip title='Add file'>
              <StyledButton variant='contained' component='label' aria-label="delete"   size='small' color='white' sx={{display: wsJunction?.file_3?'none':'flex'}}>
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