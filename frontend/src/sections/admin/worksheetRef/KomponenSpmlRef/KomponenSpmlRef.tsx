/**
 * Salamaik Client 
 * © Kanwil DJPb Sumbar 2026
 */

import { useState, useEffect } from 'react';
import { Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper,
  TableSortLabel, Tooltip, TableHead, Grow, TableBody, TableRow, TableCell } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import StyledNumberTextField from '../../../../components/styledNumberTextField/StyledNumberTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDialog from '../../../../hooks/display/useDialog';
import useDictionary, { KomponenSpmlRefType } from '../../../../hooks/useDictionary';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'urut', label: 'Urut', alignRight: false },
  { id: 'title', label: 'Nama Komponen', alignRight: false },
  { id: 'alias', label: 'Alias', alignRight: false },
  { id: 'bobot', label: 'Bobot', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface KomponenSpmlRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

// ----------------------------------------------------------------------------------
export default function KomponenSpmlRef({ section, addState, resetAddState }: KomponenSpmlRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);

  const [editID, setEditID] = useState<number | null>(null);

  const { komponenSpmlRef, getDictionary } = useDictionary();

  const axiosJWT = useAxiosJWT();

  const { openSnackbar } = useSnackbar();

  const { openDialog } = useDialog();

  const handleOpen = (id: number) => {
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddState();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosJWT.get(`/spmlRef/deleteKomponen/${id}`);
      openSnackbar(response.data.message, 'success');
      getDictionary();
    } catch (err) {
      openSnackbar('Gagal menghapus komponen SPML', 'error');
    }
  };

  useEffect(() => {
    if (addState && section === 9) {
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
              {komponenSpmlRef?.map((row, index) =>
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">{row.urut || '-'}</TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left">
                    {row.alias && <Label color="info">{row.alias}</Label>}
                  </TableCell>
                  <TableCell align="left">
                    <Label color="success">{`${row.bobot}%`}</Label>
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
                            onClick={() => openDialog('Delete', 'Yakin hapus komponen SPML ini?', 'pink', 'Delete', () => handleDelete(row.id))}>
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

      <KomponenSpmlRefModal
        modalOpen={open}
        modalClose={handleClose}
        addState={addState}
        editID={editID}
        data={komponenSpmlRef || []}
      />
    </>
  );
}


// ----------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '60vh',
  width: '50vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
};

const FormDataContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
  marginTop: theme.spacing(5),
  gap: theme.spacing(3),
}));

interface KomponenSpmlRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: KomponenSpmlRefType[],
}

// ----------------------------------------------------------------
function KomponenSpmlRefModal({ modalOpen, modalClose, addState, editID, data }: KomponenSpmlRefModalProps) {
  const { openSnackbar } = useSnackbar();
  const { getDictionary } = useDictionary();
  const axiosJWT = useAxiosJWT();

  const emptyForm: KomponenSpmlRefType = { id: 0, urut: '', title: '', bobot: 0, alias: '' };

  const [addValue, setAddValue] = useState<KomponenSpmlRefType>(emptyForm);
  const [editValue, setEditValue] = useState<KomponenSpmlRefType>(emptyForm);

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddValue({ ...addValue, [e.target.name]: e.target.name === 'bobot' ? Number(e.target.value) : e.target.value });
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue({ ...editValue, [e.target.name]: e.target.name === 'bobot' ? Number(e.target.value) : e.target.value });
  };

  const handleResetAdd = () => setAddValue(emptyForm);

  const handleResetEdit = () => {
    const row = data.find((r) => r.id === editID);
    if (row) setEditValue({ id: row.id, urut: row.urut ?? '', title: row.title, bobot: row.bobot, alias: row.alias ?? '' });
  };

  const handleAdd = async () => {
    try {
      if (addValue.bobot < 0 || addValue.bobot > 100) return openSnackbar('Bobot harus antara 0–100', 'error');
      await axiosJWT.post('/spmlRef/createKomponen', { urut: addValue.urut, title: addValue.title, bobot: addValue.bobot, alias: addValue.alias });
      openSnackbar('Komponen SPML berhasil ditambahkan', 'success');
      getDictionary();
      modalClose();
      handleResetAdd();
    } catch {
      openSnackbar('Gagal menambahkan komponen SPML', 'error');
    }
  };

  const handleEdit = async () => {
    try {
      if (editValue.bobot < 0 || editValue.bobot > 100) return openSnackbar('Bobot harus antara 0–100', 'error');
      await axiosJWT.post('/spmlRef/editKomponen', { id: editValue.id, urut: editValue.urut, title: editValue.title, bobot: editValue.bobot, alias: editValue.alias });
      openSnackbar('Komponen SPML berhasil diubah', 'success');
      getDictionary();
      modalClose();
    } catch {
      openSnackbar('Gagal mengubah komponen SPML', 'error');
    }
  };

  useEffect(() => {
    if (data && editID) {
      const row = data.find((r) => r.id === editID);
      if (row) setEditValue({ id: row.id, urut: row.urut ?? '', title: row.title, bobot: row.bobot, alias: row.alias ?? '' });
    }
  }, [data, editID]);

  return (
    <Modal open={modalOpen} onClose={modalClose}>
      <Box sx={style}>
        <Scrollbar>
          <Paper sx={{ height: '50vh', width: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{addState ? 'Add' : 'Edit'} Komponen SPML</Typography>
            <FormDataContainer>
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <Stack direction="column" spacing={3} sx={{ width: '45%' }}>
                  <FormControl>
                    <StyledTextField name="urut" label="Urut (opsional)" helperText="mis: I, II, III"
                      value={addState ? addValue.urut ?? '' : editValue.urut ?? ''}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />
                  </FormControl>
                  <FormControl>
                    <StyledTextField name="title" label="Nama Komponen" multiline minRows={2}
                      value={addState ? addValue.title : editValue.title}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />
                  </FormControl>
                  <FormControl>
                    <StyledTextField name="alias" label="Alias (opsional)" multiline minRows={2} helperText="singkatan"
                      value={addState ? addValue.alias : editValue.alias}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="column" spacing={3} sx={{ width: '45%' }}>
                  <FormControl sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
                    <StyledNumberTextField name="bobot" label="Bobot" helperText="isi angka 0 - 100"
                      value={addState ? addValue.bobot : editValue.bobot}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />%
                  </FormControl>
                </Stack>
              </Stack>
              <Stack sx={{ width: '100%', pr: 3, mt: 1 }} direction="row" spacing={2} justifyContent="end">
                <Button variant="contained" color={addState ? 'primary' : 'warning'} sx={{ borderRadius: '8px' }}
                  onClick={addState ? handleAdd : handleEdit}>
                  {addState ? 'Add' : 'Edit'}
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
