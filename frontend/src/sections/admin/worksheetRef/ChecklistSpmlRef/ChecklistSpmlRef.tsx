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
import useDictionary, { ChecklistSpmlRefType } from '../../../../hooks/useDictionary';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'uraian', label: 'Uraian', alignRight: false },
  { id: 'dokumen', label: 'Dokumen', alignRight: false },
  { id: 'aspek', label: 'Aspek', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface ChecklistSpmlRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

// ----------------------------------------------------------------------------------
export default function ChecklistSpmlRef({ section, addState, resetAddState }: ChecklistSpmlRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [editID, setEditID] = useState<number | null>(null);

  const { aspekSpmlRef, checklistSpmlRef, getDictionary } = useDictionary();
  const axiosJWT = useAxiosJWT();
  const { openSnackbar } = useSnackbar();
  const { openDialog } = useDialog();

  const handleOpen = (id: number) => { setOpen(true); setEditID(id); };
  const handleClose = () => { setOpen(false); resetAddState(); };

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosJWT.post('/spmlRef/deleteChecklist', { id });
      openSnackbar(response.data.message, 'success');
      getDictionary();
    } catch {
      openSnackbar('Gagal menghapus checklist SPML', 'error');
    }
  };

  useEffect(() => {
    if (addState && section === 8) { setEditID(null); setOpen(true); }
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
              {checklistSpmlRef?.map((row, index) =>
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left" sx={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>{row.uraian}</TableCell>
                  <TableCell align="left">{row.dokumen}</TableCell>
                  <TableCell align="left">
                    {aspekSpmlRef?.find((a) => a.id === row.aspek_spml_id)?.title}
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
                            onClick={() => openDialog('Delete', 'Yakin hapus checklist SPML ini?', 'pink', 'Delete', () => handleDelete(row.id))}>
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

      <ChecklistSpmlRefModal
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
  height: '75vh', width: '65vw',
  bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '12px',
};

const FormDataContainer = styled(Box)(({ theme }) => ({
  height: '100%', display: 'flex', flexDirection: 'column',
  alignItems: 'start', justifyContent: 'start',
  marginTop: theme.spacing(5), gap: theme.spacing(3),
}));

interface ChecklistSpmlRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
}

// ----------------------------------------------------------------
function ChecklistSpmlRefModal({ modalOpen, modalClose, addState, editID }: ChecklistSpmlRefModalProps) {
  const { komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef, checklistSpmlRef, getDictionary } = useDictionary();
  const { openSnackbar } = useSnackbar();
  const axiosJWT = useAxiosJWT();

  const emptyForm: ChecklistSpmlRefType = { id: 0, uraian: '', dokumen: '', komponen_spml_id: 0, subkomponen_spml_id: 0, aspek_spml_id: 0 };
  const [addValue, setAddValue] = useState<ChecklistSpmlRefType>(emptyForm);
  const [editValue, setEditValue] = useState<ChecklistSpmlRefType>(emptyForm);

  const filteredSubKomponen = (komponenId: number) =>
    subKomponenSpmlRef?.filter((s) => s.komponen_spml_id === Number(komponenId)) ?? [];

  const filteredAspek = (subkomponenId: number) =>
    aspekSpmlRef?.filter((a) => a.subkomponen_spml_id === Number(subkomponenId)) ?? [];

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
    const numFields = ['komponen_spml_id', 'subkomponen_spml_id', 'aspek_spml_id'];
    const val = numFields.includes(e.target.name as string) ? Number(e.target.value) : e.target.value;
    setAddValue((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown>) => {
    const numFields = ['komponen_spml_id', 'subkomponen_spml_id', 'aspek_spml_id'];
    const val = numFields.includes(e.target.name as string) ? Number(e.target.value) : e.target.value;
    setEditValue((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleResetAdd = () => setAddValue(emptyForm);
  const handleResetEdit = () => {
    const row = checklistSpmlRef?.find((r) => r.id === editID);
    if (row) setEditValue({ ...row });
  };

  const handleAdd = async () => {
    try {
      await axiosJWT.post('/spmlRef/createChecklist', {
        uraian: addValue.uraian, dokumen: addValue.dokumen,
        komponen_spml_id: addValue.komponen_spml_id,
        subkomponen_spml_id: addValue.subkomponen_spml_id,
        aspek_spml_id: addValue.aspek_spml_id,
      });
      openSnackbar('Checklist SPML berhasil ditambahkan', 'success');
      getDictionary(); modalClose(); handleResetAdd();
    } catch { openSnackbar('Gagal menambahkan checklist SPML', 'error'); }
  };

  const handleEdit = async () => {
    try {
      await axiosJWT.post('/spmlRef/editChecklist', {
        id: editValue.id, uraian: editValue.uraian, dokumen: editValue.dokumen,
        komponen_spml_id: editValue.komponen_spml_id,
        subkomponen_spml_id: editValue.subkomponen_spml_id,
        aspek_spml_id: editValue.aspek_spml_id,
      });
      openSnackbar('Checklist SPML berhasil diubah', 'success');
      getDictionary(); modalClose();
    } catch { openSnackbar('Gagal mengubah checklist SPML', 'error'); }
  };

  useEffect(() => {
    if (checklistSpmlRef && editID) {
      const row = checklistSpmlRef.find((r) => r.id === editID);
      if (row) setEditValue({ ...row });
    }
  }, [checklistSpmlRef, editID]);

  const currentVal = addState ? addValue : editValue;

  return (
    <Modal open={modalOpen} onClose={modalClose}>
      <Box sx={style}>
        <Scrollbar>
          <Paper sx={{ height: '65vh', width: 'auto', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{addState ? 'Add' : 'Edit'} Checklist SPML</Typography>
            <FormDataContainer>
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <Stack direction="column" spacing={3} sx={{ width: '50%' }}>
                  <FormControl>
                    <StyledTextField name="uraian" label="Uraian" multiline minRows={4}
                      value={addState ? addValue.uraian : editValue.uraian}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />
                  </FormControl>
                  <FormControl>
                    <StyledTextField name="dokumen" label="Dokumen" multiline minRows={2}
                      value={addState ? addValue.dokumen : editValue.dokumen}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="column" spacing={3} sx={{ width: '45%' }}>
                  <FormControl>
                    <InputLabel id="komponen-spml-cl-label" sx={{ typography: 'body2' }}>Komponen SPML</InputLabel>
                    <Select required name="komponen_spml_id" label="Komponen SPML" labelId="komponen-spml-cl-label"
                      value={currentVal.komponen_spml_id.toString()}
                      sx={{ typography: 'body2', fontSize: 14 }}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                    >
                      {komponenSpmlRef?.map((item) => (
                        <MenuItem key={item.id} sx={{ fontSize: 14 }} value={item.id}>{item.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="subkomponen-spml-cl-label" sx={{ typography: 'body2' }}>Sub Komponen SPML</InputLabel>
                    <Select required name="subkomponen_spml_id" label="Sub Komponen SPML" labelId="subkomponen-spml-cl-label"
                      value={currentVal.subkomponen_spml_id.toString()}
                      sx={{ typography: 'body2', fontSize: 14 }}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                      disabled={!currentVal.komponen_spml_id}
                    >
                      {filteredSubKomponen(currentVal.komponen_spml_id).map((item) => (
                        <MenuItem key={item.id} sx={{ fontSize: 14 }} value={item.id}>{item.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="aspek-spml-cl-label" sx={{ typography: 'body2' }}>Aspek SPML</InputLabel>
                    <Select required name="aspek_spml_id" label="Aspek SPML" labelId="aspek-spml-cl-label"
                      value={currentVal.aspek_spml_id.toString()}
                      sx={{ typography: 'body2', fontSize: 14 }}
                      onChange={addState ? handleChangeAdd : handleChangeEdit}
                      disabled={!currentVal.subkomponen_spml_id}
                    >
                      {filteredAspek(currentVal.subkomponen_spml_id).map((item) => (
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
