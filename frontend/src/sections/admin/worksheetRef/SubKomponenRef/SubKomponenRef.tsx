/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem, SelectChangeEvent} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDialog from '../../../../hooks/display/useDialog';
import useDictionary from '../../../../hooks/useDictionary';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'subkomponen', label: 'Nama Sub Komponen', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface SubKomponenRefType{
  id: number,
  komponen_id: number,
  title: string,
  detail?: string,
  alias?: string,
};

interface SubKomponenRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

//-----------------------------------------------------------------------------------
export default function SubKomponenRef({section, addState, resetAddState}: SubKomponenRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const {openDialog} = useDialog();

  const [editID, setEditID] = useState<number | null>(null);

  const { komponenRef, subKomponenRef, getDictionary } = useDictionary();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const handleOpen = (id: number) => {
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddState();
  };

  const handleDeleteKomponen = async (id: number) => {
    try {
      const response = await axiosJWT.get(`/deleteSubKomponen/${id}`);
      openSnackbar(response.data.message, "success");
      getDictionary();
    } catch (err) {
      openSnackbar("Fail to delete referensi peraturan", "error");
    }
  };
  
  //set modal state utk add Data dan hide modal state buat nge edit
  useEffect(() => {
    if (addState && section===3) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);

  useEffect(() => {
    getDictionary();
  }, []);

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
              {subKomponenRef?.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="left">{row.title}</TableCell>

                  <TableCell align="left">
                    {komponenRef?.filter((item) => item.id === row.komponen_id)[0]?.title}
                  </TableCell>

                  <TableCell align="center">{6}</TableCell>

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
                      <Tooltip title='delete' onClick={() => 
                        openDialog(
                          "Yakin hapus subkomponen?", 
                          "Subkomponen yang terhapus dapat mempengaruhi kertas kerja", 
                          'pink', 
                          'Delete', 
                          () => handleDeleteKomponen(row.id)
                        )
                      }>
                        <span>
                          <StyledButton aria-label="delete" size='small' color='pink'>
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
}


//----------------------------------------------------------------
function SubKomponenRefModal({modalOpen, modalClose, addState, editID}: SubKomponenRefModalProps) {
  const { komponenRef, subKomponenRef, getDictionary } = useDictionary();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [addValue, setAddValue] = useState<SubKomponenRefType>({
    id: 0,
    komponen_id: 0,
    title:'',
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: 0,
      komponen_id: 0,
      title:'',
    })
  };

  const [editValue, setEditValue] = useState<SubKomponenRefType>({
    id: 0,
    komponen_id: 0,
    title:'',
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: subKomponenRef?.filter((row) => row?.id===editID)?.[0]?.id || 0,
      title: subKomponenRef?.filter((row) => row?.id===editID)?.[0]?.title || '',
      komponen_id: subKomponenRef?.filter((row) => row?.id===editID)?.[0]?.komponen_id || 0,
    })
  };

  const handleAddSubKomponen = async () => {
    try {

      const form = {
        title: addValue.title,
        komponen_id: addValue.komponen_id,
      };

      const response = await axiosJWT.post('/createSubKomponen', form);

      openSnackbar(response.data.message, 'success');
      getDictionary();
      modalClose();
      handleResetAdd();
    } catch (error) {
      openSnackbar('Failed to add subkomponen', 'error');
    }
  };

  const handleEditSubKomponen = async () => {
    try {

      const form = {
        id: editValue.id,
        title: editValue.title,
        komponen_id: editValue.komponen_id,
      };

      const response = await axiosJWT.post('/editSubKomponen', form);

      openSnackbar(response.data.message, 'success');
      getDictionary();
      modalClose();
      handleResetEdit();
    } catch (error) {
      openSnackbar('Failed to edit komponen', 'error');
    }
  };

  useEffect(() => {
    if(subKomponenRef && editID){
      setEditValue({
        id: subKomponenRef?.filter((row) => row?.id===editID)?.[0]?.id || 0,
        title: subKomponenRef?.filter((row) => row?.id===editID)?.[0]?.title || '',
        komponen_id: subKomponenRef?.filter((row) => row?.id===editID)?.[0]?.komponen_id || 0,
      })
    }
  }, [subKomponenRef, editID])


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
                            name="title" 
                            label="Nama Sub Komponen"
                            multiline
                            minRows={2}
                            value={ addState? addValue.title : editValue.title}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
                          <Select 
                            required 
                            name="komponen_id" 
                            label='Komponen'
                            labelId="komponen-select-label"
                            value={addState? addValue.komponen_id.toString() : editValue.komponen_id.toString()}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          >
                            {
                              komponenRef?.map((item) => (
                                <MenuItem key={item.id} sx={{fontSize:14}} value={item.id}>{item.title}</MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                      <Button 
                        variant='contained'
                        color={addState? 'primary' : 'warning'} 
                        sx={{borderRadius:'8px'}}
                        onClick={addState? handleAddSubKomponen : handleEditSubKomponen}
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