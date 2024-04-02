import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem, Tabs, Tab, TableContainer} from '@mui/material';
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

interface ChecklistRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: ChecklistData[]
};

interface ChecklistData{
  id: number,
  checklist:string,
  kriteria:string,
  standardisasiKPPN:boolean,
  subsubkomponen:number,
  subkomponen: number,
  komponen:number,
  numChecklist?: number,
};


//----------------------------------------------------------------
export default function ChecklistRefModal({modalOpen, modalClose, addState, editID, data}: ChecklistRefModalProps) {
  const [addValue, setAddValue] = useState<ChecklistData>({
    id: 0,
    checklist:'',
    standardisasiKPPN:false,
    kriteria:'',
    subsubkomponen:0,
    subkomponen:0,
    komponen: 0,
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
      checklist:'',
      standardisasiKPPN:false,
      kriteria:'',
      subsubkomponen:0,
      subkomponen:0,
      komponen: 0,
    })
  };

  const [editValue, setEditValue] = useState<ChecklistData>({
    id: 0,
    checklist:'',
    standardisasiKPPN:false,
    kriteria:'',
    subsubkomponen:0,
    subkomponen:0,
    komponen: 0,
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: data.filter((row) => row.id===editID)[0].id,
      checklist: data.filter((row) => row.id===editID)[0].checklist,
      standardisasiKPPN: data.filter((row) => row.id===editID)[0].standardisasiKPPN,
      kriteria: data.filter((row) => row.id===editID)[0]. kriteria,
      subsubkomponen: data.filter((row) => row.id===editID)[0].subsubkomponen,
      subkomponen: data.filter((row) => row.id===editID)[0].subkomponen,
      komponen: data.filter((row) => row.id===editID)[0].komponen,
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
        checklist: data.filter((row) => row.id===editID)[0].checklist,
        standardisasiKPPN: data.filter((row) => row.id===editID)[0].standardisasiKPPN,
        kriteria: data.filter((row) => row.id===editID)[0]. kriteria,
        subsubkomponen: data.filter((row) => row.id===editID)[0].subsubkomponen,
        subkomponen: data.filter((row) => row.id===editID)[0].subkomponen,
        komponen: data.filter((row) => row.id===editID)[0].komponen,
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
                Checklist
              </Typography>

                  <FormDataContainer>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'center'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledTextField 
                            name="checklist" 
                            label="Judul Checklist"
                            multiline
                            minRows={2}
                            value={ addState? addValue.checklist : editValue.checklist}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                        <FormControl>
                          <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
                          <Select 
                            name="komponen" 
                            label='Komponen'
                            labelId="komponen-select-label"
                            value={addState? addValue.komponen : editValue.komponen}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Treasurer</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Pengelola Fiskal Representasi Kemenkeu di Daerah</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Financial Advisor</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Tata Kelola Internal</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <InputLabel id="subkomponen-select-label" sx={{typography:'body2'}}>Sub Sub Komponen</InputLabel>
                          <Select 
                            name="subSubKomponen" 
                            label='Sub Sub Komponen'
                            labelId="subsubkomponen-select-label"
                            value={addState? addValue.subsubkomponen : editValue.subsubkomponen}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Sub Sub Komponen A</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Sub Sub Komponen B</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Sub Sub Komponen C</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Sub Sub Komponen D</MenuItem>
                          </Select>
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledTextField 
                            name="kriteria" 
                            label="Header Kriteria"
                            multiline
                            minRows={2}
                            value={ addState? addValue.kriteria : editValue.kriteria}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>
                       
                        <FormControl>
                          <InputLabel id="subkomponen-select-label" sx={{typography:'body2'}}>Sub Komponen</InputLabel>
                          <Select 
                            name="subkomponen" 
                            label='Sub Komponen'
                            labelId="subkomponen-select-label"
                            value={addState? addValue.subkomponen : editValue.subkomponen}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Sub Komponen A</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Sub Komponen B</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Sub Komponen C</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Sub Komponen D</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <InputLabel id="standardisasi-kppn-label" sx={{typography:'body2'}}>Standardisasi KPPN</InputLabel>
                          <Select 
                            name="standardisasiKPPN" 
                            label='Standardisasi KPPN'
                            labelId="standardisasi-kppn-label"
                            value={addState? addValue.standardisasiKPPN : editValue.standardisasiKPPN}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Ya</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Tidak</MenuItem>
                          </Select>
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
                  </FormDataContainer>

            </Paper>
          </Scrollbar>
        </Box>
      </Modal>
      
      </>
  )
}