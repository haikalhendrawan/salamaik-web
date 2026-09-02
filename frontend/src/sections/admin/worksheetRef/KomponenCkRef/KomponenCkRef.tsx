import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useDialog from '../../../../hooks/display/useDialog';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDictionary, { KomponenCkRefType } from '../../../../hooks/useDictionary';

interface KomponenCkRefProps {
  section: number;
  addState: boolean;
  resetAddState: () => void;
}

type KomponenCkForm = Pick<KomponenCkRefType, 'urut' | 'title' | 'alias' | 'detail'>;

const EMPTY_FORM: KomponenCkForm = {
  urut: '',
  title: '',
  alias: '',
  detail: '',
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== 'object' || error === null || !('response' in error)) return fallback;

  const response = (error as { response?: { data?: { message?: unknown } } }).response;
  return typeof response?.data?.message === 'string' ? response.data.message : fallback;
}

export default function KomponenCkRef({
  section,
  addState,
  resetAddState,
}: KomponenCkRefProps) {
  const axiosJWT = useAxiosJWT();
  const { komponenCkRef, getCkDictionary } = useDictionary();
  const { openSnackbar } = useSnackbar();
  const { openDialog } = useDialog();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<KomponenCkForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    resetAddState();
  };

  const openEdit = (row: KomponenCkRefType) => {
    setEditId(row.id);
    setForm({
      urut: row.urut,
      title: row.title,
      alias: row.alias ?? '',
      detail: row.detail ?? '',
    });
    setOpen(true);
  };

  const resetForm = () => {
    if (editId) {
      const row = komponenCkRef?.find((item) => item.id === editId);
      if (row) {
        setForm({
          urut: row.urut,
          title: row.title,
          alias: row.alias ?? '',
          detail: row.detail ?? '',
        });
        return;
      }
    }
    setForm(EMPTY_FORM);
  };

  const submit = async () => {
    if (!form.urut.trim() || !form.title.trim()) return;
    try {
      setIsSubmitting(true);
      const response = editId
        ? await axiosJWT.post('/ckRef/editKomponen', { id: editId, ...form })
        : await axiosJWT.post('/ckRef/createKomponen', form);
      await getCkDictionary();
      openSnackbar(response.data.message, 'success');
      closeModal();
    } catch (error) {
      openSnackbar(getErrorMessage(error, 'Gagal menyimpan komponen CK'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteRow = async (id: number) => {
    try {
      setIsSubmitting(true);
      const response = await axiosJWT.post('/ckRef/deleteKomponen', { id });
      await getCkDictionary();
      openSnackbar(response.data.message, 'success');
    } catch (error) {
      openSnackbar(getErrorMessage(error, 'Gagal menghapus komponen CK'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (addState && section === 12) {
      setEditId(null);
      setForm(EMPTY_FORM);
      setOpen(true);
    }
  }, [addState, section]);

  return (
    <>
      <Card sx={{ minHeight: 480 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Urut</TableCell>
                <TableCell>Nama Komponen</TableCell>
                <TableCell>Alias</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {komponenCkRef?.map((row, index) => (
                <TableRow hover key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.urut}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.alias || '-'}</TableCell>
                  <TableCell sx={{ maxWidth: 320, whiteSpace: 'normal' }}>
                    {row.detail || '-'}
                  </TableCell>
                  <TableCell align="center">
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
                            'Hapus Komponen CK',
                            'Yakin menghapus komponen CK ini?',
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
              {komponenCkRef?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">Belum ada referensi komponen CK.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>

      <Dialog open={open} onClose={isSubmitting ? undefined : closeModal} fullWidth maxWidth="md">
        <DialogTitle>{editId ? 'Edit' : 'Add'} Komponen CK</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <StyledTextField
                required
                fullWidth
                label="Urut"
                value={form.urut}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setForm((current) => ({ ...current, urut: event.target.value }))
                }
              />
              <StyledTextField
                required
                fullWidth
                label="Nama Komponen"
                value={form.title}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </Stack>
            <StyledTextField
              fullWidth
              label="Alias"
              value={form.alias ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, alias: event.target.value }))
              }
            />
            <StyledTextField
              fullWidth
              multiline
              minRows={3}
              label="Detail"
              value={form.detail ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, detail: event.target.value }))
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
            disabled={isSubmitting || !form.urut.trim() || !form.title.trim()}
          >
            {isSubmitting ? 'Menyimpan...' : editId ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
