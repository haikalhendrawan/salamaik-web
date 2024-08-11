import {useState, useEffect} from'react';
import {Stack, Button, Box, Typography, Modal, FormControl, SelectChangeEvent, 
          Paper, Grid, Select, MenuItem, InputLabel} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useChecklist, {ChecklistType ,OpsiType} from './useChecklist';
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
  editID: number,
  checklist: ChecklistType[] | [],
  opsi: OpsiType[] | null,
  opsiID: number,
  addState: boolean
};

interface TitleType{
  checklistTitle: string,
  headerTitle: string
}
//----------------------------------------------------------------
export default function ChecklistOpsiModal({
  modalOpen, 
  modalClose, 
  editID,
  checklist,
  opsi, 
  opsiID,
  addState}: ChecklistOpsiModalModalProps) {
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const {getChecklist} = useChecklist();

  const [title, setTitle] = useState<TitleType>({
    checklistTitle: '',
    headerTitle: ''
  });

  // const [addValue, setAddValue] = useState<OpsiType>({
  //   id: 0,
  //   title: '',
  //   value: 0,
  //   checklist_id:0,
  // });

  // const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setAddValue({
  //     ...addValue,
  //     [e.target.name]:e.target.value
  //   })
  // };

  // const handleResetAdd = () => {
  //   setAddValue({
  //     id: 0,
  //     title: '',
  //     value: 0,
  //     checklist_id:0,
  //   })
  // };

  const [editValue, setEditValue] = useState<OpsiType>({
    id: 0,
    title: '',
    value: 0,
    checklist_id:0,
    positive_fallback: '',
    negative_fallback: '',
    rekomendasi: ''
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> |  SelectChangeEvent) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: opsi?.filter((row) => row.id===opsiID)[0]?.id || 0,
      title: opsi?.filter((row) => row.id===opsiID)[0]?.title || '',
      value: opsi?.filter((row) => row.id===opsiID)[0]?.value || 0,
      checklist_id: opsi?.filter((row) => row.id===opsiID)[0]?.checklist_id || 0,
      positive_fallback: '',
      negative_fallback: '',
      rekomendasi: ''
    })
  };

  const handleSubmitEdit = async() => {
    try{
       await axiosJWT.post("/editOpsi", {
        id: editValue.id,
        title: editValue.title,
        value: editValue.value,
        checklistId: editValue.checklist_id,
        positiveFallback: editValue.positive_fallback,
        negativeFallback: editValue.negative_fallback,
        rekomendasi: editValue.rekomendasi
      });
      await getChecklist();
      modalClose();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar("Network Error", "error");
      }
    }
  };

  useEffect(() => {
    if(opsi && editID && checklist){
      setEditValue({
        id: opsi?.filter((row) => row.id===opsiID)[0]?.id || 0,
        title: opsi?.filter((row) => row.id===opsiID)[0]?.title || '',
        value: opsi?.filter((row) => row.id===opsiID)[0]?.value || 0,
        checklist_id: opsi?.filter((row) => row.id===opsiID)[0]?.checklist_id || 0,
        positive_fallback: opsi?.filter((row) => row.id===opsiID)[0]?.positive_fallback || '',
        negative_fallback: opsi?.filter((row) => row.id===opsiID)[0]?.negative_fallback || '',
        rekomendasi: opsi?.filter((row) => row.id===opsiID)[0]?.rekomendasi || ''
      })

      setTitle({
        checklistTitle: checklist[0]?.title || '',
        headerTitle: checklist[0]?.header || ''
      })
    }
  }, [opsi, editID])


  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal keepMounted open={modalOpen} onClose={modalClose}>
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
                     {title.checklistTitle}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container sx={{ mb: 2, ml: 4}}>
                  <Grid item xs={2}>
                    <Typography variant="body1" fontWeight={'bold'} >
                      Header
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="body1" fontWeight={'bold'}>
                      : 
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sx={{textAlign:'justify'}}>
                    <Typography variant="body3">
                      {title.headerTitle} 
                    </Typography>
                  </Grid>
                </Grid>

                <Stack direction='column' spacing={2} sx={{width:'100%', ml:4}} justifyContent={'center'}>
                  <Stack direction='row' spacing={3} sx={{width:'100%'}} alignItems={'start'}>
                    <FormControl sx={{width:'20%'}}>
                      <InputLabel id="value-select-label" sx={{typography:'body2'}}>Nilai</InputLabel>
                      <Select 
                        name="value" 
                        label='Nilai'
                        labelId="opsiValue-select-label"
                        value={editValue.value.toString()}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                        onChange={handleChangeEdit}
                      >
                        <MenuItem key={0} sx={{fontSize:14}} value={0}>0</MenuItem>
                        <MenuItem key={1} sx={{fontSize:14}} value={5}>5</MenuItem>
                        <MenuItem key={2} sx={{fontSize:14}} value={7}>7</MenuItem>
                        <MenuItem key={3} sx={{fontSize:14}} value={10}>10</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{width:'70%'}}>
                      <StyledTextField 
                        name="title" 
                        label="Kriteria"
                        multiline
                        minRows={2}
                        value={editValue.title}
                        onChange={handleChangeEdit}
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction='row' spacing={3} sx={{width:'100%'}} alignItems={'start'}>
                    <FormControl sx={{width:'30%'}}>
                      <StyledTextField 
                        name="positive_fallback" 
                        label="Positive Fallback"
                        multiline
                        minRows={2}
                        value={editValue.positive_fallback}
                        onChange={handleChangeEdit}
                      />
                    </FormControl>

                    <FormControl sx={{width:'30%'}}>
                      <StyledTextField 
                        name="negative_fallback" 
                        label="Negative Fallback"
                        multiline
                        minRows={2}
                        value={editValue.negative_fallback}
                        onChange={handleChangeEdit}
                      />
                    </FormControl>

                    <FormControl sx={{width:'30%'}}>
                      <StyledTextField 
                        name="rekomendasi" 
                        label="Rekomendasi"
                        multiline
                        minRows={2}
                        value={editValue.rekomendasi}
                        onChange={handleChangeEdit}
                      />
                    </FormControl>
                  </Stack>
                  
                </Stack>

                <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                  <Button 
                    variant='contained'
                    color={addState? 'primary' : 'warning'} 
                    sx={{borderRadius:'8px'}}
                    onClick={handleSubmitEdit}
                  >
                    {addState? 'Add' : 'Edit'} 
                  </Button>
                  <Button 
                    variant='contained' 
                    color="white"
                    onClick={handleResetEdit}
                  >
                    Reset
                  </Button>
                </Stack>

                {/* <Stack sx={{width: '100%', mt: 4}}>
                  <Divider />
                </Stack> */}

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Opsi Eksisting
                </Typography>

                {opsi?.map((row, index) => (
                  <Grid 
                    container
                    key={index} 
                    sx={{ ml: 4, 
                          backgroundColor: opsi?.filter((row) => row.id===opsiID)[0]?.value === row.value
                                ?theme.palette.grey[300]
                                : null,
                        }}
                  >
                    <Grid item xs={2}>
                      <Typography 
                        variant="body1" 
                        fontWeight={'bold'} 
                        color={row.value===10?'success.main':row.value===0?'error.main':'warning.main'}>
                        {row.value}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography variant="body1" fontWeight={'bold'}>
                        : 
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{textAlign:'justify'}}>
                      <Typography variant="body3">
                        {row.title}
                      </Typography>
                    </Grid>
                </Grid>
                ))}

              </FormDataContainer>



            </Paper>
          </Scrollbar>
        </Box>
      </Modal>
      
      </>
  )
}