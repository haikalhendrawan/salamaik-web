/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, TableSortLabel,
          Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import StyledNumberTextField from '../../../../components/styledNumberTextField/StyledNumberTextField';
import useDialog from '../../../../hooks/display/useDialog';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'komponen', label: 'Nama Komponen', alignRight: false },
  { id: 'bobot', label: 'Bobot', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface KomponenData{
  id: number,
  title: string,
  bobot: number,
  detail?: string,
  alias?: string,
  deleted?: string | null
};


interface KomponenRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

// ----------------------------------------------------------------------------------
export default function KomponenRef({section, addState, resetAddState}: KomponenRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<number | null>(null);

  const [komponenRef, setKomponenRef] = useState<KomponenData[]>([]);

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const {openDialog} = useDialog();

  const handleOpen = (id: number) => {
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddState();
  };

  const getData = async () => {
    try {
      const response = await axiosJWT.get("/getAllKomponenExisting");
      setKomponenRef(response.data.rows);
    } catch (err) {
      openSnackbar("Fail to get referensi peraturan", "error");
    }
  };

  const handleDeleteKomponen = async (id: number) => {
    try {
      const response = await axiosJWT.get(`/deleteKomponen/${id}`);
      openSnackbar(response.data.message, "success");
      getData();
    } catch (err) {
      openSnackbar("Fail to delete referensi peraturan", "error");
    }
  };
  
  //set modal state utk add Data dan hide modal state buat nge edit
  useEffect(() => {
    if (addState && section===2) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);

  useEffect(() => {
    getData();
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
                    <TableSortLabel hideSortIcon>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {komponenRef?.filter(item=>item.deleted===null).map((row, index) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{index+1}</TableCell>

                  <TableCell align="left">{row.title}</TableCell>

                  <TableCell align="left">
                    <Label color={'success'}>
                    {`${row.bobot}%`}
                    </Label>
                  </TableCell>

                  <TableCell align="center">{10}</TableCell>

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
                            value='contained'
                            size='small' 
                            color='pink'
                            onClick={() => openDialog(
                              "Delete",
                              "Yakin hapus komponen ini?",
                              'pink',
                              'Delete',
                              () => handleDeleteKomponen(row.id)
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

      <KomponenRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={komponenRef || []}
        getData={getData}
      /> 
    </>
  )
}


// ----------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height:'60vh',
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

interface KomponenRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: KomponenData[],
  getData: () => void
}


//----------------------------------------------------------------
function KomponenRefModal({modalOpen, modalClose, addState, editID, data, getData}: KomponenRefModalProps) {
  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [addValue, setAddValue] = useState<KomponenData>({
    id: 0,
    title: '',
    bobot: 0,
    alias: '',
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.name === 'bobot' ? Number(e.target.value) : e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: 0,
      title: '',
      bobot: 0,
      alias: '',
    })
  };

  const [editValue, setEditValue] = useState<KomponenData>({
    id: 0,
    title: 'null',
    bobot: 0,
    alias: '',
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue({
      ...editValue,
      [e.target.name]: e.target.name === 'bobot' ? Number(e.target.value) : e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: data.filter((row) => row.id===editID)[0].id,
      title: data.filter((row) => row.id===editID)[0].title,
      bobot: data.filter((row) => row.id===editID)[0].bobot,
      alias: data.filter((row) => row.id===editID)[0].alias,
    })
  };

  const handleAddKomponen = async () => {
    try {
      if(addValue.bobot<0 || addValue.bobot>100) {
        return openSnackbar('Bobot tidak boleh kurang dari 0 atau lebih besar dari 100', 'error');
      }

      const form = {
        title: addValue.title,
        bobot: addValue.bobot,
        alias: addValue.alias,
      };

      const response = await axiosJWT.post('/createKomponen', form);

      openSnackbar(response.data.message, 'success');
      getData();
      modalClose();
      handleResetAdd();
    } catch (error) {
      openSnackbar('Failed to add komponen', 'error');
    }
  };

  const handleEditKomponen = async () => {
    try {
      if(editValue.bobot<0 || editValue.bobot>100) {
        return openSnackbar('Bobot tidak boleh kurang dari 0 atau lebih besar dari 100', 'error');
      }

      const form = {
        id: editValue.id,
        title: editValue.title,
        bobot: editValue.bobot,
        alias: editValue.alias,
      };

      const response = await axiosJWT.post('/editKomponen', form);

      openSnackbar(response.data.message, 'success');
      getData();
      modalClose();
      handleResetEdit();
    } catch (error) {
      openSnackbar('Failed to edit komponen', 'error');
    }
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
        title: data.filter((row) => row.id===editID)[0].title,
        bobot: data.filter((row) => row.id===editID)[0].bobot,
        alias: data.filter((row) => row.id===editID)[0].alias,
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
                Komponen
              </Typography>

                  <FormDataContainer>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledTextField 
                            name="title" 
                            label="Nama Komponen"
                            multiline
                            minRows={2}
                            value={ addState? addValue.title : editValue.title}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                        <FormControl>
                          <StyledTextField 
                            name="alias" 
                            label="Alias Komponen (opsional)"
                            multiline
                            minRows={2}
                            value={ addState? addValue.alias : editValue.alias}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                            helperText="singkatan"
                          />
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl sx={{display:'flex', alignItems:'center', flexDirection: 'row', gap:2}}>
                          <StyledNumberTextField 
                            name="bobot" 
                            label="Bobot"
                            value={ addState? addValue.bobot : editValue.bobot}
                            onChange={addState? handleChangeAdd : handleChangeEdit}  
                            helperText="isi angka 0 - 100"
                          />%
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                      <Button 
                        variant='contained'
                        color={addState? 'primary' : 'warning'} 
                        sx={{borderRadius:'8px'}}
                        onClick={addState? handleAddKomponen : handleEditKomponen}
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
