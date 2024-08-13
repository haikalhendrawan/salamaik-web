import { Stack, Typography, Tooltip} from '@mui/material';
import Label from '../../../../components/label/Label';
import StyledButton from '../../../../components/styledButton/StyledButton';
import Iconify from '../../../../components/iconify/Iconify';
import {useAuth} from '../../../../hooks/useAuth';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDialog from '../../../../hooks/display/useDialog';
import { FindingsResponseType } from '../../types';
// --------------------------------------------------------------------------------
export default function Approval({findingResponse, getData}: {findingResponse: FindingsResponseType | null, getData: () => void}) {
  const {auth} = useAuth();

  const isKanwilnAdmin = auth?.kppn ==='03010' && (auth?.role === 4 || auth?.role === 99);

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const {openDialog} = useDialog();

  const status = findingResponse?.status || 0;

  const statusColor = ['pink', 'warning', 'pink', 'success'];

  const statusText = ['Belum', 'Proses', 'Ditolak', 'Disetujui'];

  const handleUpdateStatus = async(status: number) => {
    try{
      const response = await axiosJWT.post('/updateFindingStatus', {
        id: findingResponse?.id,
        status,
        userName: auth?.username
      });
      getData();
      openSnackbar(response.data.message, "success");
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }
  };

  return (
    <Stack direction='column' spacing={3}>
      <Stack direction='column' spacing={1}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Status :</Typography>
          <Stack direction='row' spacing={1}>
            <Label color={statusColor[status]}> {statusText[status]} </Label>
          </Stack>
      </Stack>
      
      <Stack direction='column' spacing={1} visibility={isKanwilnAdmin ? 'visible' : 'hidden'}>
        <Typography variant='body3' sx={{fontSize:12}} textAlign={'left'}>Action :</Typography>
        <Stack direction='row' spacing={1}>
          {status === 0  || status === 1?
            <>
              <Tooltip title='Approve'>
                <span>
                  <StyledButton 
                    aria-label="approve" 
                    variant='contained' 
                    size='small' 
                    color='success'
                    onClick={() => openDialog(
                      "Setuju Tindak Lanjut", 
                      "Setujui tindak lanjut KPPN? pastikan bukti dukung telah memadai", 
                      'success', 
                      'Setuju', 
                      () => handleUpdateStatus(3))
                    } 
                  >
                    <Iconify icon="solar:check-circle-bold-duotone"/>
                  </StyledButton>
                </span>
              </Tooltip>
              <Tooltip title='Tolak'>
                <span>
                  <StyledButton 
                    aria-label="tolak" 
                    variant='contained' 
                    size='small' 
                    color='error'
                    onClick={() => openDialog(
                      "Tindak Tindak Lanjut", 
                      "Tolak tindak lanjut KPPN?", 
                      'pink', 
                      'Tolak', 
                      () => handleUpdateStatus(2))
                    }
                  >
                    <Iconify icon="solar:close-circle-bold"/>
                  </StyledButton>
                </span>
              </Tooltip>
            </>
          : null
          }
          {(status === 2 || status ===3) ?
            <Tooltip title='Revert status'>
              <span>
                <StyledButton
                  aria-label="revert" 
                  variant='contained' 
                  size='small' 
                  color='pink'
                  onClick={() => openDialog(
                    "Revert Status", 
                    "Revert status tindak lanjut?", 
                    'pink', 
                    'Ya', 
                    () => handleUpdateStatus(1))
                  }
                >
                  <Iconify icon="solar:refresh-bold"/>
                </StyledButton>
              </span>
            </Tooltip>
          : null}
        </Stack>
      </Stack>
      
    </Stack>   
  )
}
