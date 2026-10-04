import { useEffect, useState } from 'react';
import { Box, Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { Regulation2MatrixRow } from '../types';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';

interface Props {
  row: Regulation2MatrixRow | null;
  onClose: () => void;
  getMatrix: () => Promise<void>;
}

const fields = [
  ['hasil_implementasi', 'Hasil Implementasi di Lapangan'],
  ['permasalahan', 'Permasalahan'],
  ['rekomendasi', 'Rekomendasi atas Permasalahan'],
  ['peraturan', 'Peraturan/Ketentuan Terkait'],
  ['uic', 'PIC Subbag/Seksi'],
  ['tindak_lanjut', 'Tindak Lanjut Atas Permasalahan'],
] as const;

export default function MatrixTablePeraturan2EditModal({ row, onClose, getMatrix }: Props) {
  const [values, setValues] = useState<Record<(typeof fields)[number][0], string>>({
    hasil_implementasi: '', permasalahan: '', rekomendasi: '', peraturan: '', uic: '', tindak_lanjut: '',
  });
  const axiosJWT = useAxiosJWT();
  const { setIsLoading } = useLoading();
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (!row) return;
    setValues({
      hasil_implementasi: row.hasil_implementasi || '',
      permasalahan: row.permasalahan || '',
      rekomendasi: row.rekomendasi || '',
      peraturan: row.peraturan || '',
      uic: row.uic || '',
      tindak_lanjut: row.tindak_lanjut || '',
    });
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    try {
      setIsLoading(true);
      const response = await axiosJWT.post('/updateMatrix', {
        id: row.matrix_id,
        hasilImplementasi: values.hasil_implementasi,
        permasalahan: values.permasalahan,
        rekomendasi: values.rekomendasi,
        peraturan: values.peraturan,
        uic: values.uic,
        tindakLanjut: values.tindak_lanjut,
      });
      await getMatrix();
      openSnackbar(response.data.message || 'Matriks berhasil diperbarui', 'success');
      onClose();
    } catch (error: any) {
      openSnackbar(error?.response?.data?.message || 'Gagal memperbarui matriks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={Boolean(row)} onClose={onClose}>
      <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '92vw', md: 760 }, maxHeight: '90vh', overflowY: 'auto', p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Edit Matriks {row?.worksheet_type || ''}</Typography>
        <Stack spacing={2}>
          {fields.map(([name, label]) => (
            <TextField
              key={name}
              label={label}
              name={name}
              value={values[name]}
              onChange={(event) => setValues((previous) => ({ ...previous, [name]: event.target.value }))}
              multiline
              minRows={2}
              fullWidth
            />
          ))}
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button color="inherit" onClick={onClose}>Batal</Button>
            <Button variant="contained" color="warning" onClick={handleSave}>Simpan</Button>
          </Box>
        </Stack>
      </Paper>
    </Modal>
  );
}
