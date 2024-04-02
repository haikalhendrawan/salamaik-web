import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Scrollbar from '../../../components/scrollbar';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../components/styledButton/StyledButton';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'subkomponen', label: 'Nama Sub Komponen', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface SubKomponenData{
  id: number,
  subkomponen: string,
  komponen:number,
  numChecklist?: number,
}

const TABLE_DATA: SubKomponenData[] = [
  {id:1, subkomponen:'Pengelolaan Anggaran dan kebijaan yang aktual bagi pemeringah stempat dan perangkat', komponen:0, numChecklist:10},
  {id:2, subkomponen:'Pengelolaan APBD', komponen:1, numChecklist:34},
  {id:3, subkomponen:'TURT', komponen:2, numChecklist:5},
  {id:4, subkomponen:'Pengelolaan SDM', komponen:3, numChecklist:17},
];

interface SubKomponenRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

//-----------------------------------------------------------------------------------
export default function SubKomponenRef({section, addState, resetAddState}: SubKomponenRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddState();
  };
  
  //set modal state utk add Data dan hide modal state buat nge edit
  useEffect(() => {
    if (addState && section===3) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);

  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignRight ? 'right' : 'left'}
                  >
                    <TableSortLabel
                      hideSortIcon
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_DATA.map((row) => 
                <TableRow hover key={0} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="left">{row.subkomponen}</TableCell>

                  <TableCell align="left">
                    {row.komponen}
                  </TableCell>

                  <TableCell align="center">{row.numChecklist}</TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='edit'>
                        <span>
                          <StyledButton 
                            aria-label="edit" 
                            variant='contained' 
                            size='small' 
                            color='warning'
                            onClick={() => handleOpen(row.id)}
                          >
                            <Iconify icon="solar:pen-bold-duotone"/>
                          </StyledButton>
                        </span>
                      </Tooltip>
                      <Tooltip title='delete'>
                        <span>
                          <StyledButton aria-label="delete" disabled variant='contained' size='small' color='white'>
                            <Iconify icon="solar:trash-bin-trash-bold"/>
                          </StyledButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell> 
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </Grow>

      <SubKomponenRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={TABLE_DATA}
        /> 
    </>
  )
}


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

interface SubKomponenRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: SubKomponenData[]
}


//----------------------------------------------------------------
function SubKomponenRefModal({modalOpen, modalClose, addState, editID, data}: SubKomponenRefModalProps) {
  const [addValue, setAddValue] = useState<SubKomponenData>({
    id: 0,
    subkomponen:'',
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
      subkomponen:'',
      komponen: 0,
    })
  };

  const [editValue, setEditValue] = useState<SubKomponenData>({
    id: 0,
    subkomponen:'',
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
      subkomponen: data.filter((row) => row.id===editID)[0].subkomponen,
      komponen: data.filter((row) => row.id===editID)[0].komponen,
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
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
            <Paper sx={{height:'50vh', width:'auto', p:2}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addState? 'Add ':'Edit '} 
                Sub Komponen
              </Typography>

                  <FormDataContainer>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledTextField 
                            name="subkomponen" 
                            label="Nama Sub Komponen"
                            multiline
                            minRows={2}
                            value={ addState? addValue.subkomponen : editValue.subkomponen}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
                          <Select 
                            required 
                            name="kondisi" 
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