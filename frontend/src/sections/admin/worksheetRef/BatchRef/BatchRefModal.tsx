import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
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
  height:'55vh',
  width: '50vw',
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

interface BatchData{
  id: number,
  periodID: number,
  kppnID: number,
  kppnName: string,
  batchStatus: number,
  openPeriod: string,
  closePeriod: string
};

interface BatchRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: BatchData[]
}


//----------------------------------------------------------------
export default function BatchRefModal({modalOpen, modalClose, addState, editID, data}: BatchRefModalProps) {
  const [addValue, setAddValue] = useState<BatchData>({
    id: 0,
    periodID: 0,
    kppnID: 0,
    kppnName: '',
    batchStatus: 0,
    openPeriod:'',
    closePeriod:''
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
      periodID: 0,
      kppnID: 0,
      kppnName: '',
      batchStatus: 0,
      openPeriod:'',
      closePeriod:''
    })
  };

  const [editValue, setEditValue] = useState<BatchData>({
    id: 0,
    periodID: 0,
    kppnID: 0,
    kppnName: '',
    batchStatus: 0,
    openPeriod:'',
    closePeriod:''
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
      periodID: data.filter((row) => row.id===editID)[0]. periodID,
      kppnID: data.filter((row) => row.id===editID)[0].kppnID,
      kppnName: data.filter((row) => row.id===editID)[0].kppnName,
      batchStatus: data.filter((row) => row.id===editID)[0].batchStatus,
      openPeriod: data.filter((row) => row.id===editID)[0].openPeriod,
      closePeriod: data.filter((row) => row.id===editID)[0].closePeriod
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
        periodID: data.filter((row) => row.id===editID)[0]. periodID,
        kppnID: data.filter((row) => row.id===editID)[0].kppnID,
        kppnName: data.filter((row) => row.id===editID)[0].kppnName,
        batchStatus: data.filter((row) => row.id===editID)[0].batchStatus,
        openPeriod: data.filter((row) => row.id===editID)[0].openPeriod,
        closePeriod: data.filter((row) => row.id===editID)[0].closePeriod
      })
    }
  }, [data, editID])


  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal open={modalOpen} onClose={modalClose}>
        <Box sx={style}>
          <Scrollbar>
            <Paper sx={{height:'50vh', width:'auto', p:2}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addState? 'Add ':'Edit '} 
                Period
              </Typography>

                  <FormDataContainer>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledTextField 
                            name="periodName" 
                            label="Nama Periode"
                            multiline
                            minRows={2}
                            value={ addState? addValue.batchStatus : editValue.batchStatus}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <InputLabel id="openPeriod-select-label" sx={{typography:'body2'}}>Open Period</InputLabel>
                          <Select 
                            required 
                            name="openPeriod" 
                            label='Open Period'
                            labelId="openPeriod-select-label"
                            value={addState? addValue.openPeriod : editValue.openPeriod}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Treasurer</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Pengelola Fiskal Representasi Kemenkeu di Daerah</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Financial Advisor</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Tata Kelola Internal</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <InputLabel id="closePeriod-select-label" sx={{typography:'body2'}}>Close Period</InputLabel>
                          <Select 
                            required 
                            name="closePeriod" 
                            label='Close Period'
                            labelId="closePeriod-select-label"
                            value={addState? addValue.closePeriod : editValue.closePeriod}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Treasurer</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Pengelola Fiskal Representasi Kemenkeu di Daerah</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Financial Advisor</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Tata Kelola Internal</MenuItem>
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