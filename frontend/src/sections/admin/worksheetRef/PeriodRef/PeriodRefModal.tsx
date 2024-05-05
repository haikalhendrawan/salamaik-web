import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import StyledDatePicker from '../../../../components/styledDatePicker/StyledDatePicker';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import { StyledSelect, StyledSelectLabel } from '../../../../components/styledSelect';
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



interface PeriodType{
  id: number,
  name: string,
  start: string,
  end: string,
  semester: number,
  tahun: string,
};

interface PeriodRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: PeriodType[] | null
};


//----------------------------------------------------------------
export default function PeriodRefModal({modalOpen, modalClose, addState, editID, data}: PeriodRefModalProps) {
  const [addValue, setAddValue] = useState<PeriodType>({
    id: 0,
    name: '',
    start: '',
    end: '',
    semester: 0,
    tahun: '',
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
      name: '',
      start: '',
      end: '',
      semester: 0,
      tahun: '',
    })
  };

  const [editValue, setEditValue] = useState<PeriodType>({
    id: 0,
    name: '',
    start: '',
    end: '',
    semester: 0,
    tahun: '',
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: data?.filter((row) => row.id===editID)[0].id || 0,
      name: data?.filter((row) => row.id===editID)[0].name || '',
      start: data?.filter((row) => row.id===editID)[0].start || '',
      end: data?.filter((row) => row.id===editID)[0].end || '',
      semester: data?.filter((row) => row.id===editID)[0].semester || 0,
      tahun: data?.filter((row) => row.id===editID)[0].tahun || '',
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
        name: data.filter((row) => row.id===editID)[0].name,
        start: data.filter((row) => row.id===editID)[0].start,
        end: data.filter((row) => row.id===editID)[0].end,
        semester: data.filter((row) => row.id===editID)[0].semester,
        tahun: data.filter((row) => row.id===editID)[0].tahun,
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
                            value={ addState? addValue.name : editValue.name}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                            <StyledDatePicker
                              name="date"
                              label={'Start Date'}
                            />
                        </FormControl>

                        <FormControl>
                            <StyledDatePicker
                              name="date"
                              label={'End Date'}
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
                  </FormDataContainer>

            </Paper>
          </Scrollbar>
        </Box>
      </Modal>
      
      </>
  )
}