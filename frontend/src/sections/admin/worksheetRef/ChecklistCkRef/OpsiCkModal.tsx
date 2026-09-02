import { useEffect, useState, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Label from '../../../../components/label';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useDialog from '../../../../hooks/display/useDialog';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useDictionary, {
  ChecklistCkRefType,
  OpsiCkRefType,
} from '../../../../hooks/useDictionary';

type OptionMode = 'add' | 'edit';

interface OpsiCkModalProps {
  open: boolean;
  onClose: () => void;
  checklist: ChecklistCkRefType | undefined;
  options: OpsiCkRefType[];
  mode: OptionMode;
  selectedOptionId: number | null;
  onSelectOption: (optionId: number) => void;
  onSwitchToAdd: () => void;
}

interface OpsiCkForm {
  urut: number;
  value: 0 | 5 | 10;
  label: string;
  description: string;
}

const EMPTY_FORM: OpsiCkForm = {
  urut: 1,
  value: 10,
  label: '',
  description: '',
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== 'object' || error === null || !('response' in error)) return fallback;

  const response = (error as { response?: { data?: { message?: unknown } } }).response;
  return typeof response?.data?.message === 'string' ? response.data.message : fallback;
}

function getOptionColor(value: number): 'success' | 'warning' | 'pink' {
  if (value === 10) return 'success';
  if (value === 5) return 'warning';
  return 'pink';
}

export default function OpsiCkModal({
  open,
  onClose,
  checklist,
  options,
  mode,
  selectedOptionId,
  onSelectOption,
  onSwitchToAdd,
}: OpsiCkModalProps) {
  const axiosJWT = useAxiosJWT();
  const { getCkDictionary } = useDictionary();
  const { openSnackbar } = useSnackbar();
  const { openDialog } = useDialog();
  const [form, setForm] = useState<OpsiCkForm>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOption = options.find((item) => item.id === selectedOptionId);
  const isFormValid = form.urut > 0 && form.label.trim() !== '' && Boolean(checklist);

  const resetForm = () => {
    if (mode === 'edit' && selectedOption) {
      setForm({
        urut: selectedOption.urut,
        value: selectedOption.value,
        label: selectedOption.label,
        description: selectedOption.description ?? '',
      });
      return;
    }
    setForm(EMPTY_FORM);
  };

  const submit = async () => {
    if (!checklist || !isFormValid) return;
    try {
      setIsSubmitting(true);
      const payload = {
        checklist_ck_id: checklist.id,
        urut: form.urut,
        value: form.value,
        label: form.label,
        description: form.description,
      };
      const response =
        mode === 'edit' && selectedOptionId
          ? await axiosJWT.post('/ckRef/editOpsi', { id: selectedOptionId, ...payload })
          : await axiosJWT.post('/ckRef/createOpsi', payload);

      await getCkDictionary();
      openSnackbar(response.data.message, 'success');
      if (mode === 'add') {
        setForm(EMPTY_FORM);
      }
    } catch (error) {
      openSnackbar(getErrorMessage(error, 'Gagal menyimpan opsi CK'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteOption = async () => {
    if (!selectedOptionId) return;
    try {
      setIsSubmitting(true);
      const response = await axiosJWT.post('/ckRef/deleteOpsi', { id: selectedOptionId });
      await getCkDictionary();
      openSnackbar(response.data.message, 'success');
      onSwitchToAdd();
      setForm(EMPTY_FORM);
    } catch (error) {
      openSnackbar(getErrorMessage(error, 'Gagal menghapus opsi CK'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const option = options.find((item) => item.id === selectedOptionId);
    if (mode === 'edit' && option) {
      setForm({
        urut: option.urut,
        value: option.value,
        label: option.label,
        description: option.description ?? '',
      });
      return;
    }
    setForm(EMPTY_FORM);
  }, [mode, selectedOptionId, options]);

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === 'add' ? 'Add' : 'Edit'} Opsi CK</DialogTitle>
      <DialogContent>
        {checklist && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.neutral' }}>
            <Grid container spacing={1}>
              <Grid item xs={3} md={2}><Typography variant="body2" fontWeight={700}>Checklist</Typography></Grid>
              <Grid item xs={9} md={10}>
                <Typography variant="body2">{checklist.urut}. {checklist.materi}</Typography>
              </Grid>
              <Grid item xs={3} md={2}><Typography variant="body2" fontWeight={700}>Kriteria</Typography></Grid>
              <Grid item xs={9} md={10}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {checklist.kriteria_penilaian}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <StyledTextField
              required
              fullWidth
              type="number"
              label="Urut Opsi"
              value={form.urut || ''}
              inputProps={{ min: 1 }}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, urut: Number(event.target.value) }))
              }
            />
            <FormControl fullWidth required>
              <InputLabel id="nilai-opsi-ck-checklist-label">Nilai</InputLabel>
              <Select
                labelId="nilai-opsi-ck-checklist-label"
                label="Nilai"
                value={form.value}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    value: Number(event.target.value) as 0 | 5 | 10,
                  }))
                }
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <StyledTextField
            required
            fullWidth
            label="Label"
            value={form.label}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, label: event.target.value }))
            }
          />
          <StyledTextField
            fullWidth
            multiline
            minRows={3}
            label="Deskripsi"
            value={form.description}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6">Opsi Eksisting</Typography>
          {mode === 'edit' && (
            <Button size="small" onClick={onSwitchToAdd} disabled={isSubmitting}>
              Tambah opsi baru
            </Button>
          )}
        </Stack>

        <Stack spacing={1}>
          {options.map((option) => (
            <Box
              key={option.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectOption(option.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelectOption(option.id);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                borderRadius: 1,
                cursor: 'pointer',
                bgcolor: selectedOptionId === option.id ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Label color={getOptionColor(option.value)}>{option.value}</Label>
              <Typography variant="body2" fontWeight={600}>{option.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description || '-'}
              </Typography>
            </Box>
          ))}
          {options.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Belum ada opsi untuk checklist ini.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {mode === 'edit' && selectedOptionId && (
          <Button
            color="error"
            disabled={isSubmitting}
            onClick={() =>
              openDialog(
                'Hapus Opsi CK',
                'Yakin menghapus opsi CK ini?',
                'pink',
                'Hapus',
                () => void deleteOption()
              )
            }
          >
            Hapus
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={resetForm} disabled={isSubmitting}>Reset</Button>
        <Button color="inherit" onClick={onClose} disabled={isSubmitting}>Close</Button>
        <Button
          variant="contained"
          color={mode === 'edit' ? 'warning' : 'primary'}
          disabled={isSubmitting || !isFormValid}
          onClick={() => void submit()}
        >
          {isSubmitting ? 'Menyimpan...' : mode === 'edit' ? 'Edit' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
