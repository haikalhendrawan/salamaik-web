import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Modal, FormControl, 
          Paper, Grid, Select, MenuItem, InputLabel, Divider} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height:'80vh',
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

interface ChecklistOpsiModalModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: OpsiData[]
};

interface OpsiData{
  opsiID: number,
  checklistID: number,
  opsiTitle: string,
  opsiValue: number
};


//----------------------------------------------------------------
export default function ChecklistOpsiModal({modalOpen, modalClose, addState, editID, data}: ChecklistOpsiModalModalProps) {
  const theme = useTheme();

  const [addValue, setAddValue] = useState<OpsiData>({
    opsiID: 0,
    checklistID:0,
    opsiTitle: '',
    opsiValue: 0,
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      opsiID: 0,
      checklistID:0,
      opsiTitle: '',
      opsiValue: 5
    })
  };

  const [editValue, setEditValue] = useState<OpsiData>({
    opsiID: 0,
    checklistID:0,
    opsiTitle: '',
    opsiValue: 0,
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      opsiID: data.filter((row) => row.opsiID===editID)[0].opsiID,
      checklistID: data.filter((row) => row.opsiID===editID)[0].checklistID,
      opsiTitle: data.filter((row) => row.opsiID===editID)[0].opsiTitle,
      opsiValue: data.filter((row) => row.opsiID===editID)[0].opsiValue,
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        opsiID: data.filter((row) => row.opsiID===editID)[0].opsiID,
        checklistID: data.filter((row) => row.opsiID===editID)[0].checklistID,
        opsiTitle: data.filter((row) => row.opsiID===editID)[0].opsiTitle,
        opsiValue: data.filter((row) => row.opsiID===editID)[0].opsiValue,
      })
    }
  }, [data, editID])


  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal open={modalOpen} onClose={modalClose}>
        <Box sx={style}>
          <Scrollbar>
            <Paper sx={{height:'80vh', width:'auto', p:2}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addState? 'Add ':'Edit '} 
                Opsi
              </Typography>

              <FormDataContainer>
                <Grid container sx={{ml: 4}}>
                  <Grid item xs={2}>
                    <Typography variant="body1" fontWeight={'bold'} >
                      Checklist 
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      : 
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{textAlign:'justify'}}>
                    <Typography variant="body3">
                      Akurasi RPD Harian Satker secara semesteran (deviasi : (30%*deviasi unit) + (70%*deviasi nilai))
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{ mb: 2, ml: 4}}>
                  <Grid item xs={2}>
                    <Typography variant="body1" fontWeight={'bold'} >
                      Header Kriteria
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      : 
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{textAlign:'justify'}}>
                    <Typography variant="body3">
                      Berdasarkan tingkat deviasi RPD dari aplikasi MonSAKTI/OMSPAN pada modul renkas 
                    </Typography>
                  </Grid>
                </Grid>

                <Stack direction='row' spacing={2} sx={{width:'100%', ml:4}} justifyContent={'center'}>
                  <Stack direction='row' spacing={3} sx={{width:'100%'}} alignItems={'start'}>
                    <FormControl sx={{width:'20%'}}>
                      <InputLabel id="opsiValue-select-label" sx={{typography:'body2'}}>Nilai</InputLabel>
                      <Select 
                        name="opsiValue" 
                        label='Nilai'
                        labelId="opsiValue-select-label"
                        value={addState? addValue.opsiValue : editValue.opsiValue}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                      >
                        <MenuItem key={0} sx={{fontSize:14}} value={0}>10</MenuItem>
                        <MenuItem key={1} sx={{fontSize:14}} value={1}>7</MenuItem>
                        <MenuItem key={2} sx={{fontSize:14}} value={2}>5</MenuItem>
                        <MenuItem key={3} sx={{fontSize:14}} value={3}>0</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{width:'70%'}}>
                      <StyledTextField 
                        name="opsiTitle" 
                        label="Kriteria"
                        multiline
                        minRows={2}
                        value={ addState? addValue.opsiTitle : editValue.opsiTitle}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                      />
                    </FormControl>

                  </Stack>

                </Stack>

                <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                  <Button 
                    variant='contained'
                    color={addState? 'primary' : 'warning'} 
                    sx={{borderRadius:'8px'}}
                  >
                    {addState? 'Add' : 'Edit'} 
                  </Button>
                  <Button 
                    variant='contained' 
                    color="white"
                    onClick={addState? handleResetAdd : handleResetEdit}
                  >
                    Reset
                  </Button>
                </Stack>

                <Stack sx={{width: '100%', mt: 4}}>
                  <Divider />
                </Stack>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Opsi Eksisting
                </Typography>

                <Grid container sx={{ml: 4}}>
                  <Grid item xs={2}>
                    <Typography variant="body1" fontWeight={'bold'} color='success.main'>
                      10
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      : 
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{textAlign:'justify'}}>
                    <Typography variant="body3">
                      Nilai Deviasi antara 0 s.d. 1,99%
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{ml: 4}}>
                  <Grid item xs={2}>
                    <Typography variant="body1" fontWeight={'bold'} color='warning.main'>
                      5
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      : 
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{textAlign:'justify'}}>
                    <Typography variant="body3">
                      Nilai Deviasi antara 2 s.d. 5%
                    </Typography>
                  </Grid>
                </Grid>

              </FormDataContainer>



            </Paper>
          </Scrollbar>
        </Box>
      </Modal>
      
      </>
  )
}