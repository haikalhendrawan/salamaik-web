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

interface ChecklistType{
  id: number,
  title: string, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number | null,
  subsubkomponen_id: number | number,
  standardisasi: number | null, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  opsi: OpsiType[] | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};

interface ChecklistOpsiModalModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number,
  checklist: ChecklistType[] | [],
  opsi: OpsiType[] | null,
  opsiID: number
};

interface TitleType{
  checklistTitle: string,
  headerTitle: string
}
//----------------------------------------------------------------
export default function ChecklistOpsiModal({
  modalOpen, 
  modalClose, 
  addState,
  editID,
  checklist,
  opsi, 
  opsiID}: ChecklistOpsiModalModalProps) {
  const theme = useTheme();

  const [title, setTitle] = useState<TitleType>({
    checklistTitle: '',
    headerTitle: ''
  });

  const [addValue, setAddValue] = useState<OpsiType>({
    id: 0,
    title: '',
    value: 0,
    checklist_id:0,
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: 0,
      title: '',
      value: 0,
      checklist_id:0,
    })
  };

  const [editValue, setEditValue] = useState<OpsiType>({
    id: 0,
    title: '',
    value: 0,
    checklist_id:0,
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    })
  };

  useEffect(() => {
    if(opsi && editID && checklist){
      setEditValue({
        id: opsi?.filter((row) => row.id===opsiID)[0]?.id || 0,
        title: opsi?.filter((row) => row.id===opsiID)[0]?.title || '',
        value: opsi?.filter((row) => row.id===opsiID)[0]?.value || 0,
        checklist_id: opsi?.filter((row) => row.id===opsiID)[0]?.checklist_id || 0,
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

                <Stack direction='row' spacing={2} sx={{width:'100%', ml:4}} justifyContent={'center'}>
                  <Stack direction='row' spacing={3} sx={{width:'100%'}} alignItems={'start'}>
                    <FormControl sx={{width:'20%'}}>
                      <InputLabel id="opsiValue-select-label" sx={{typography:'body2'}}>Nilai</InputLabel>
                      <Select 
                        name="opsiValue" 
                        label='Nilai'
                        labelId="opsiValue-select-label"
                        value={addState? addValue.value : editValue.value}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                      >
                        <MenuItem key={0} sx={{fontSize:14}} value={0}>0</MenuItem>
                        <MenuItem key={1} sx={{fontSize:14}} value={5}>5</MenuItem>
                        <MenuItem key={2} sx={{fontSize:14}} value={7}>7</MenuItem>
                        <MenuItem key={3} sx={{fontSize:14}} value={10}>10</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{width:'70%'}}>
                      <StyledTextField 
                        name="opsiTitle" 
                        label="Kriteria"
                        multiline
                        minRows={2}
                        value={ addState? addValue.title : editValue.title}
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

                {/* <Stack sx={{width: '100%', mt: 4}}>
                  <Divider />
                </Stack> */}

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Opsi Eksisting
                </Typography>

                {opsi?.map((row) => (
                  <Grid 
                    container 
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