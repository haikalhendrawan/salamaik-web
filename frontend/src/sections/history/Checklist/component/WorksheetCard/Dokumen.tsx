/**
*Salamaik Client 
* © Kanwil DJPb Sumbar 2024
*/

import { useCallback, useMemo, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Skeleton  from "@mui/material/Skeleton";
import useTheme  from '@mui/material/styles/useTheme';
import styled  from '@mui/material/styles/styled';
import usePreviewFileModal from '../../usePreviewFileModal';
import Iconify from "../../../../../components/iconify";
import StyledButton from "../../../../../components/styledButton/StyledButton";
import { WsJunctionType, WorksheetType } from '../../types';
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
  wsJunction: WsJunctionType | null,
  wsDetail: WorksheetType | null,
}

// ----------------------------------------------------------------------------
export default function Dokumen({openInstruction, wsJunction}: DokumenProps){
  const [isMounted, setIsMounted] = useState(true);

  const theme = useTheme();

  const { handleSetIsExampleFile, modalOpen, changeFile, selectId, setFileOption } = usePreviewFileModal();

  const handleOpenExampleFile = useCallback((option: number) => {
    const baseDir = "checklist";
    const fileOption = option===1?wsJunction?.file1:wsJunction?.file2;
    modalOpen();
    changeFile(baseDir+ '/' + fileOption || '');
    handleSetIsExampleFile(true);
  }, [modalOpen, wsJunction]);

  const handleOpenWsJunctionFile = useCallback((option: number) => {
    const baseDir = "worksheet";
    const fileOption = [wsJunction?.file_1, wsJunction?.file_2, wsJunction?.file_3][option-1];
    setFileOption(option);
    modalOpen();
    changeFile(baseDir+ '/' + fileOption || '');
    handleSetIsExampleFile(false);
    selectId(wsJunction?.junction_id || 0);
  }, [modalOpen, wsJunction]);

  const isMaxFile = useMemo(() => {
    return wsJunction?.file_1 && wsJunction?.file_2 && wsJunction?.file_3;
  }, [wsJunction]);

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return (
      <>
        <Skeleton variant="rounded" height={'3em'} width={'50%'} />
        <br/>
        <br/>
        <Skeleton variant="rounded" height={'3em'} width={'50%'} />
      </>
    )
  }

  return(
    <>
      <Stack direction='column' spacing={2}>
        <Stack direction='column' spacing={1}>
          <Typography variant='body3' fontSize={12} textAlign={'left'}>Petunjuk :</Typography>
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
                  <Iconify color={theme.palette.grey[500]} icon="solar:info-circle-bold"/>
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
          <Typography variant='body3' fontSize={12} textAlign={'left'}>Bukti Dukung :</Typography>
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
                      onClick={() => handleOpenWsJunctionFile(1)}
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
                      onClick={() => handleOpenWsJunctionFile(2)}
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
                      onClick={() => handleOpenWsJunctionFile(3)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              !isMaxFile
              ?
                <Tooltip title='Add file'>
                  <span>
                    <StyledButton 
                      variant='contained' 
                      component='label' 
                      aria-label="delete" 
                      size='small' 
                      color='white' 
                      disabled
                    >
                      <Iconify 
                        icon="solar:add-circle-bold"
                        color={theme.palette.grey[500]}
                      />
                      <VisuallyHiddenInput 
                        type='file'
                        accept='image/*,.pdf,.zip' 
                      />
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
           
          </Stack>
        </Stack>
      </Stack>   
    </>
  )
}