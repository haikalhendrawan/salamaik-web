/**
 * Salamaik Client 
 * © Kanwil DJPb Sumbar 2026
 */

import { useState, useEffect } from 'react';
import { Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper,
  InputLabel, TableSortLabel, Tooltip, TableHead, Grow, TableBody, TableRow, TableCell,
  Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDialog from '../../../../hooks/display/useDialog';
import useDictionary, { SubKomponenSpmlRefType } from '../../../../hooks/useDictionary';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'title', label: 'Nama Sub Komponen', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface SubKomponenSpmlRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

// ----------------------------------------------------------------------------------
export default function SubKomponenSpmlRef({ section, addState, resetAddState }: SubKomponenSpmlRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [editID, setEditID] = useState<number | null>(null);

  const { komponenSpmlRef, subKomponenSpmlRef, getDictionary } = useDictionary();
  const axiosJWT = useAxiosJWT();
  const { openSnackbar } = useSnackbar();
  const { openDialog } = useDialog();

  const handleOpen = (id: number) => { setOpen(true); setEditID(id); };
  const handleClose = () => { setOpen(false); resetAddState(); };

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosJWT.get(`/spmlRef/deleteSubKomponen/${id}`);
      openSnackbar(response.data.message, 'success');
      getDictionary();
    } catch {
      openSnackbar('Gagal menghapus subkomponen SPML', 'error');
    }
  };

  useEffect(() => {
    if (addState && section === 10) { setEditID(null); setOpen(true); }
  }, [addState, section]);

  useEffect(() => { getDictionary(); }, []);

  return (
    <>
      <Grow in>
        <Card sx={{ minHeight: 480, display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
                    <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {subKomponenSpmlRef?.map((row, index) =>
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left">
                    {komponenSpmlRef?.find((k) => k.id === row.komponen_spml_id)?.title}
                  </TableCell>
                  <TableCell align="left">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="edit">
                        <span>
                          <StyledButton aria-label="edit" variant="contained" size="small" color="warning" onClick={() => handleOpen(row.id)}>
                            <Iconify icon="solar:pen-bold-duotone" />
                          </StyledButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="delete">
                        <span>
                          <StyledButton aria-label="delete" size="small" color="pink"
                            onClick={() => openDialog('Delete', 'Yakin hapus subkomponen SPML ini?', 'pink', 'Delete', () => handleDelete(row.id))}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
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

      <SubKomponenSpmlRefModal
        modalOpen={open}
        modalClose={handleClose}
        addState={addState}
        editID={editID}
      />
    </>
  );
}


// ----------------------------------------------------------------------------------
const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '55vh', width: '50vw',
  bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '12px',
};

const FormDataContainer = styled(Box)(({ theme }) => ({
  height: '100%', display: 'flex', flexDirection: 'column',
  alignItems: 'start', justifyContent: 'start',
  marginTop: theme.spacing(5), gap: theme.spacing(3),
}));

interface SubKomponenSpmlRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
}

// ----------------------------------------------------------------
function SubKomponenSpmlRefModal({ modalOpen, modalClose, addState, editID }: SubKomponenSpmlRefModalProps) {
  const { komponenSpmlRef, subKomponenSpmlRef, getDictionary } = useDictionary();
  const { openSnackbar } = useSnackbar();
  const axiosJWT = useAxiosJWT();

  const emptyForm = { id: 0, komponen_spml_id: 0, title: '' };
  const [addValue, setAddValue] = useState<SubKomponenSpmlRefType>(emptyForm);
  const [editValue, setEditValue] = useState<SubKomponenSpmlRefType>(emptyForm);

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
    setAddValue({ ...addValue, [e.target.name]: e.target.value });
  };
  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value });
  };

  const handleResetAdd = () => setAddValue(emptyForm);
  const handleResetEdit = () => {
    const row = subKomponenSpmlRef?.find((r) => r.id === editID);
    if (row) setEditValue({ id: row.id, title: row.title, komponen_spml_id: row.komponen_spml_id });
  };

  const handleAdd = async () => {
    try {
      await axiosJWT.post('/spmlRef/createSubKomponen', { title: addValue.title, komponen_spml_id: Number(addValue.komponen_spml_id) });
      openSnackbar('SubKomponen SPML berhasil ditambahkan', 'success');
      getDictionary(); modalClose(); handleResetAdd();
    } catch { openSnackbar('Gagal menambahkan subkomponen SPML', 'error'); }
  };

  const handleEdit = async () => {
    try {
      await axiosJWT.post('/spmlRef/editSubKomponen', { id: editValue.id, title: editValue.title, komponen_spml_id: Number(editValue.komponen_spml_id) });
      openSnackbar('SubKomponen SPML berhasil diubah', 'success');
      getDictionary(); modalClose();
    } catch { openSnackbar('Gagal mengubah subkomponen SPML', 'error'); }
  };

  useEffect(() => {
    if (subKomponenSpmlRef && editID) {
      const row = subKomponenSpmlRef.find((r) => r.id === editID);
      if (row) setEditValue({ id: row.id, title: row.title, komponen_spml_id: row.komponen_spml_id });
    }
  }, [subKomponenSpmlRef, editID]);

  return (
    <Modal open={modalOpen} onClose={modalClose}>
      <Box sx={style}>
        <Scrollbar>
          <Paper sx={{ height: '50vh', width: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{addState ? 'Add' : 'Edit'} Sub Komponen SPML</Typography>
            <FormDataContainer>
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <Stack direction="column" spacing={3} sx={{ width: '45%' }}>
                  <FormControl>
                    <StyledTextField name="title" label="Nama Sub Komponen" multiline minRows={2}
                      value={addState ? addValue.title : editValue.title}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="column" spacing={3} sx={{ width: '45%' }}>
                  <FormControl>
                    <InputLabel id="komponen-spml-label" sx={{ typography: 'body2' }}>Komponen SPML</InputLabel>
                    <Select required name="komponen_spml_id" label="Komponen SPML" labelId="komponen-spml-label"
                      value={addState ? addValue.komponen_spml_id.toString() : editValue.komponen_spml_id.toString()}
                      sx={{ typography: 'body2', fontSize: 14, height: '100%' }}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    >
                      {komponenSpmlRef?.map((item) => (
                        <MenuItem key={item.id} sx={{ fontSize: 14 }} value={item.id}>{item.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <Stack sx={{ width: '100%', pr: 3, mt: 1 }} direction="row" spacing={2} justifyContent="end">
                <Button variant="contained" color={addState ? 'primary' : 'warning'} sx={{ borderRadius: '8px' }}
                  onClick={addState ? handleAdd : handleEdit}>{addState ? 'Add' : 'Edit'}
                </Button>
                <Button variant="contained" color="white" onClick={addState ? handleResetAdd : handleResetEdit}>Reset</Button>
              </Stack>
            </FormDataContainer>
          </Paper>
        </Scrollbar>
      </Box>
    </Modal>
  );
}
