import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useDialog from '../../../../hooks/display/useDialog';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDictionary, {
  ChecklistCkRefType,
  OpsiCkRefType,
} from '../../../../hooks/useDictionary';
import OpsiCkModal from './OpsiCkModal';

interface ChecklistCkRefProps {
  section: number;
  addState: boolean;
  resetAddState: () => void;
}

interface ChecklistCkForm {
  komponen_ck_id: number;
  urut: number;
  materi: string;
  kriteria_penilaian: string;
  bukti_dukung: string;
}

const EMPTY_FORM: ChecklistCkForm = {
  komponen_ck_id: 0,
  urut: 0,
  materi: '',
  kriteria_penilaian: '',
  bukti_dukung: '',
};

type OptionMode = 'add' | 'edit';

function getOptionColor(value: number): 'success' | 'warning' | 'pink' {
  if (value === 10) return 'success';
  if (value === 5) return 'warning';
  return 'pink';
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== 'object' || error === null || !('response' in error)) return fallback;

  const response = (error as { response?: { data?: { message?: unknown } } }).response;
  return typeof response?.data?.message === 'string' ? response.data.message : fallback;
}

export default function ChecklistCkRef({
  section,
  addState,
  resetAddState,
}: ChecklistCkRefProps) {
  const axiosJWT = useAxiosJWT();
  const { komponenCkRef, checklistCkRef, opsiCkRef, getCkDictionary } = useDictionary();
  const { openSnackbar } = useSnackbar();
  const { openDialog } = useDialog();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ChecklistCkForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [optionMode, setOptionMode] = useState<OptionMode>('add');

  const toForm = (row: ChecklistCkRefType): ChecklistCkForm => ({
    komponen_ck_id: row.komponen_ck_id,
    urut: row.urut,
    materi: row.materi,
    kriteria_penilaian: row.kriteria_penilaian,
    bukti_dukung: row.bukti_dukung ?? '',
  });

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    resetAddState();
  };

  const openEdit = (row: ChecklistCkRefType) => {
    setEditId(row.id);
    setForm(toForm(row));
    setOpen(true);
  };

  const resetForm = () => {
    const row = editId ? checklistCkRef?.find((item) => item.id === editId) : undefined;
    setForm(row ? toForm(row) : EMPTY_FORM);
  };

  const isFormValid =
    form.komponen_ck_id > 0 &&
    form.urut > 0 &&
    form.materi.trim() !== '' &&
    form.kriteria_penilaian.trim() !== '';

  const submit = async () => {
    if (!isFormValid) return;
    try {
      setIsSubmitting(true);
      const response = editId
        ? await axiosJWT.post('/ckRef/editChecklist', { id: editId, ...form })
        : await axiosJWT.post('/ckRef/createChecklist', form);
      await getCkDictionary();
      openSnackbar(response.data.message, 'success');
      closeModal();
    } catch (error) {
      openSnackbar(getErrorMessage(error, 'Gagal menyimpan checklist CK'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRow = async (id: number) => {
    try {
      setIsSubmitting(true);
      const response = await axiosJWT.post('/ckRef/deleteChecklist', { id });
      await getCkDictionary();
      openSnackbar(response.data.message, 'success');
    } catch (error) {
      openSnackbar(getErrorMessage(error, 'Gagal menghapus checklist CK'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddOption = (checklistId: number) => {
    setSelectedChecklistId(checklistId);
    setSelectedOptionId(null);
    setOptionMode('add');
    setOptionModalOpen(true);
  };

  const openEditOption = (checklistId: number, optionId: number) => {
    setSelectedChecklistId(checklistId);
    setSelectedOptionId(optionId);
    setOptionMode('edit');
    setOptionModalOpen(true);
  };

  const closeOptionModal = () => {
    setOptionModalOpen(false);
    setSelectedChecklistId(null);
    setSelectedOptionId(null);
    setOptionMode('add');
  };

  const selectOption = (optionId: number) => {
    setSelectedOptionId(optionId);
    setOptionMode('edit');
  };

  const switchOptionToAdd = () => {
    setSelectedOptionId(null);
    setOptionMode('add');
  };

  const selectedChecklist = checklistCkRef?.find(
    (item) => item.id === selectedChecklistId
  );
  const selectedChecklistOptions = (opsiCkRef ?? [])
    .filter((item) => item.checklist_ck_id === selectedChecklistId)
    .sort((left, right) => left.urut - right.urut || left.id - right.id);

  useEffect(() => {
    if (addState && section === 13) {
      setEditId(null);
      setForm(EMPTY_FORM);
      setOpen(true);
    }
  }, [addState, section]);

  return (
    <>
      <Card sx={{ minHeight: 480 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 1250 }}>
            <TableHead>
              <TableRow>
                <TableCell>Urut</TableCell>
                <TableCell>Komponen</TableCell>
                <TableCell>Materi</TableCell>
                <TableCell>Kriteria Penilaian</TableCell>
                <TableCell align="center">Opsi</TableCell>
                <TableCell>Bukti Dukung</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checklistCkRef?.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.urut}</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>
                    {row.komponen_urut}. {row.komponen_title}
                  </TableCell>
                  <TableCell sx={{ minWidth: 260, maxWidth: 320, whiteSpace: 'normal' }}>
                    {row.materi}
                  </TableCell>
                  <TableCell sx={{ minWidth: 320, maxWidth: 420, whiteSpace: 'pre-line' }}>
                    {row.kriteria_penilaian}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 170 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {(opsiCkRef ?? [])
                        .filter((item) => item.checklist_ck_id === row.id)
                        .sort((left, right) => left.urut - right.urut || left.id - right.id)
                        .map((option: OpsiCkRefType) => (
                          <Label
                            key={option.id}
                            color={getOptionColor(option.value)}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => openEditOption(row.id, option.id)}
                          >
                            {option.value}
                          </Label>
                        ))}
                      <Tooltip title="Tambah opsi">
                        <IconButton size="small" onClick={() => openAddOption(row.id)}>
                          <Iconify icon="solar:add-square-bold" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ minWidth: 280, maxWidth: 380, whiteSpace: 'pre-line' }}>
                    {row.bukti_dukung || '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 120 }}>
                    <Tooltip title="Edit">
                      <IconButton color="warning" onClick={() => openEdit(row)} disabled={isSubmitting}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        disabled={isSubmitting}
                        onClick={() =>
                          openDialog(
                            'Hapus Checklist CK',
                            'Yakin menghapus checklist CK ini?',
                            'pink',
                            'Hapus',
                            () => void deleteRow(row.id)
                          )
                        }
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {checklistCkRef?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">Belum ada referensi checklist CK.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>

      <Dialog open={open} onClose={isSubmitting ? undefined : closeModal} fullWidth maxWidth="md">
        <DialogTitle>{editId ? 'Edit' : 'Add'} Checklist CK</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="komponen-ck-checklist-label">Komponen CK</InputLabel>
                <Select
                  labelId="komponen-ck-checklist-label"
                  label="Komponen CK"
                  value={form.komponen_ck_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      komponen_ck_id: Number(event.target.value),
                    }))
                  }
                >
                  <MenuItem value={0} disabled>Pilih komponen</MenuItem>
                  {komponenCkRef?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.urut}. {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <StyledTextField
                required
                fullWidth
                type="number"
                label="Urut Checklist"
                value={form.urut || ''}
                inputProps={{ min: 1 }}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setForm((current) => ({ ...current, urut: Number(event.target.value) }))
                }
              />
            </Stack>
            <StyledTextField
              required
              fullWidth
              multiline
              minRows={2}
              label="Materi"
              value={form.materi}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, materi: event.target.value }))
              }
            />
            <StyledTextField
              required
              fullWidth
              multiline
              minRows={5}
              label="Kriteria Penilaian"
              value={form.kriteria_penilaian}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, kriteria_penilaian: event.target.value }))
              }
            />
            <StyledTextField
              fullWidth
              multiline
              minRows={4}
              label="Bukti Dukung"
              value={form.bukti_dukung}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, bukti_dukung: event.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button color="inherit" onClick={resetForm} disabled={isSubmitting}>Reset</Button>
          <Button color="inherit" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
          <Button
            variant="contained"
            color={editId ? 'warning' : 'primary'}
            onClick={() => void submit()}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? 'Menyimpan...' : editId ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <OpsiCkModal
        open={optionModalOpen}
        onClose={closeOptionModal}
        checklist={selectedChecklist}
        options={selectedChecklistOptions}
        mode={optionMode}
        selectedOptionId={selectedOptionId}
        onSelectOption={selectOption}
        onSwitchToAdd={switchOptionToAdd}
      />
    </>
  );
}
