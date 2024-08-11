import {useState, useEffect} from'react';
import {Stack, Button, Box, Typography, Modal, FormControl, Paper, InputLabel, 
        Select, MenuItem, SelectChangeEvent} from '@mui/material';
import { styled } from '@mui/material/styles';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import { MatrixWithWsJunctionType } from '../../types';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height:'90vh',
  width: '65vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius:'12px',
};

const FormDataContainer = styled(Box)(({theme}) => ({
  height:'100%',
  display: 'flex', 
  flexDirection:'column', 
  alignItems:'start', 
  justifyContent:'start', 
  marginTop:theme.spacing(5),
  gap:theme.spacing(3)
}));

interface MatrixTableEditModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  matrix: MatrixWithWsJunctionType | null,
  getMatrix: () => Promise<void>
};
// -------------------------------------------------------------------------------------------

export default function MatrixTableEditModal({modalOpen, modalClose, matrix, getMatrix}: MatrixTableEditModalProps) {
  const [value, setValue] = useState<MatrixWithWsJunctionType>({
    id: 0,
    worksheet_id: '',
    ws_junction_id: 0,
    checklist_id: 0,
    hasil_implementasi: null,
    permasalahan: null,
    rekomendasi: null,
    peraturan: null,
    uic: null,
    tindak_lanjut: null,
    is_finding: 0,
    komponen_string: null,
    subkomponen_string: null,
    ws_junction: [],
    checklist: [],
    findings: [],
  });

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> |  SelectChangeEvent) => {
    setValue({
      ...value,
      [event.target.name]:event?.target?.value,
    })
  };

  const handleReset = () => {
    matrix?setValue(matrix):null
  };

  const handleSubmitEdit = async() => {
    const body = {
      id: value?.id,
      hasilImplementasi: value?.hasil_implementasi,
      permasalahan: value.permasalahan,
      rekomendasi: value.rekomendasi,
      peraturan: value.peraturan,
      uic: value.uic,
      tindak_lanjut: value.tindak_lanjut,
      isFinding: value.is_finding,
    }
    console.log(body);

    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/updateMatrix`, body);
      openSnackbar(response.data.message, "success");
      modalClose();
      await getMatrix();
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    matrix?setValue(matrix):null
  }, [matrix])
  
  return(
    <>
      <Modal keepMounted open={modalOpen} onClose={modalClose}>
        <Box sx={style}>
          <Scrollbar>
            <Paper sx={{height:'80vh', width:'auto', p:2}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Edit Matriks
              </Typography>

              <FormDataContainer>
                <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'center'}>
                  <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                    <FormControl>
                      <StyledTextField 
                        name="hasil_implementasi" 
                        label="Hasil Implementasi"
                        multiline
                        minRows={2}
                        value={value?.hasil_implementasi || ''}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <StyledTextField 
                        name="rekomendasi" 
                        label="Rekomendasi Atas Permasalahan"
                        multiline
                        minRows={2}
                        value={value?.rekomendasi || ''}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <StyledTextField 
                        name="uic" 
                        label="PIC"
                        multiline
                        minRows={2}
                        value={value?.uic || ''}
                        onChange={handleChange}
                      />
                    </FormControl>

                  </Stack>
                  <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                    <FormControl>
                      <StyledTextField 
                        name="permasalahan" 
                        label="Permasalahan apabila ada"
                        multiline
                        minRows={2}
                        value={value?.permasalahan || ''}
                        onChange={handleChange}
                      />
                    </FormControl>
                  
                    <FormControl>
                      <StyledTextField 
                        name="peraturan" 
                        label="Peraturan Terkait"
                        multiline
                        minRows={2}
                        value={value?.peraturan || ''}
                        onChange={handleChange}
                      />
                    </FormControl>

                  </Stack>
                </Stack>

                <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                  <Button 
                    variant='contained'
                    color={'warning'} 
                    sx={{borderRadius:'8px'}}
                    onClick={handleSubmitEdit}
                  >
                    {'Edit'} 
                  </Button>
                  <Button 
                    variant='contained' 
                    color="white"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Stack>
              </FormDataContainer>

            </Paper>
          </Scrollbar>
        </Box>
      </Modal>
    </>
  )
}
