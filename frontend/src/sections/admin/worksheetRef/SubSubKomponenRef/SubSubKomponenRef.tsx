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
import useDictionary from '../../../../hooks/useDictionary';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDialog from '../../../../hooks/display/useDialog';
import { SubSubKomponenType } from '../../../../types/komponen.type';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'subsubkomponen', label: 'Nama Sub Sub Komponen', alignRight: false },
  { id: 'subkomponen', label: 'Sub Komponen', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface SubSubKomponenRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};
//------------------------------------------------------------------------------------
export default function SubSubKomponenRef({section, addState, resetAddState}: SubSubKomponenRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<number | null>(null);

  const { komponenRef, subKomponenRef, subSubKomponenRef, getDictionary } = useDictionary();

  const {openDialog} = useDialog();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const handleOpen = (id: number) => {
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddState();
  };

  const handleDeleteSubKomponen = async (id: number) => {
    try {
      const response = await axiosJWT.get(`/deleteSubSubKomponen/${id}`);
      openSnackbar(response.data.message, "success");
      getDictionary();
    } catch (err) {
      openSnackbar("Fail to delete referensi peraturan", "error");
    }
  };
  
  //set modal state utk add Data dan hide modal state buat nge edit
  useEffect(() => {
    if (addState && section===4) {
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
              {subSubKomponenRef?.map((row, index) => 
                <TableRow hover key={index+1} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="left">{row.title}</TableCell>

                  <TableCell align="left">
                    {subKomponenRef?.filter((item) => item.id === row.subkomponen_id)[0].title}
                  </TableCell>

                  <TableCell align="left">
                    {komponenRef?.filter((item) => item.id === row.komponen_id)[0].title}
                  </TableCell>

                  <TableCell align="center">{5}</TableCell>

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
                          <StyledButton 
                            aria-label="delete" 
                            variant='contained' 
                            size='small' 
                            color='white'
                            onClick={() => openDialog(
                              "Yakin hapus sub sub komponen?",
                              "Subsubkomponen yang terhapus dapat mempengaruhi kertas kerja",
                              "warning",
                              "Delete",
                              () => handleDeleteSubKomponen(row.id)
                            )}
                          >
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

      <SubSubKomponenRefModal 
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

interface SubSubKomponenRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
}


//----------------------------------------------------------------
function SubSubKomponenRefModal({modalOpen, modalClose, addState, editID}: SubSubKomponenRefModalProps) {
  const {komponenRef, subKomponenRef, subSubKomponenRef, getDictionary} = useDictionary();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [addValue, setAddValue] = useState<SubSubKomponenType>({
    id: 0,
    title:'',
    subkomponen_id:0,
    komponen_id: 0,
    detail: '',
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
      title:'',
      subkomponen_id:0,
      komponen_id: 0,
      detail: '',
    })
  };

  const [editValue, setEditValue] = useState<SubSubKomponenType>({
    id: 0,
    title:'',
    subkomponen_id:0,
    komponen_id: 0,
    detail: '',
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleAddSubSubKomponen = async () => {
    try {
      const form = {
        title: addValue.title,
        komponen_id: addValue.komponen_id,
        subkomponen_id: addValue.subkomponen_id,
        detail: null
      };

      const response = await axiosJWT.post('/createSubSubKomponen', form);

      openSnackbar(response.data.message, 'success');
      getDictionary();
      modalClose();
      handleResetAdd();
    } catch (error) {
      openSnackbar('Failed to add subkomponen', 'error');
    }
  };

  const handleEditSubSubKomponen = async () => {
    try {
      const form = {
        id: editValue.id,
        title: editValue.title,
        komponen_id: editValue.komponen_id,
        subkomponen_id: editValue.subkomponen_id,
        detail: null
      };

      const response = await axiosJWT.post('/editSubSubKomponen', form);

      openSnackbar(response.data.message, 'success');
      getDictionary();
      modalClose();
      handleResetEdit();
    } catch (error) {
      openSnackbar('Failed to edit komponen', 'error');
    }
  };


  const handleResetEdit = () => {
    setEditValue({
      id: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.id || 0,
      title: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.title || '',
      subkomponen_id: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.subkomponen_id || 0,
      komponen_id: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.komponen_id || 0,
      detail: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.detail || '',
    })
  };

  useEffect(() => {
    if(subSubKomponenRef && editID){
      setEditValue({
        id: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.id || 0,
        title: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.title || '',
        subkomponen_id: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.subkomponen_id || 0,
        komponen_id: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.komponen_id || 0,
        detail: subSubKomponenRef?.filter((row) => row.id===editID)[0]?.detail || '',
      })
    }
  }, [subSubKomponenRef, editID])


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
                            label="Nama Sub Sub Komponen"
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

                        <FormControl>
                          <InputLabel id="subkomponen-select-label" sx={{typography:'body2'}}>Sub Komponen</InputLabel>
                          <Select 
                            name="subkomponen_id" 
                            label='Sub Komponen'
                            labelId="subkomponen-select-label"
                            value={addState? addValue.subkomponen_id.toString() : editValue.subkomponen_id.toString()}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          >
                            {
                              subKomponenRef?.filter((row) => row.komponen_id===(addState? addValue.komponen_id : editValue.komponen_id)).map((item) => (
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
                        onClick={addState? handleAddSubSubKomponen : handleEditSubSubKomponen} 
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