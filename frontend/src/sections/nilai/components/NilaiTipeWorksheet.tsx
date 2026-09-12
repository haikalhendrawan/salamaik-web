import { Stack, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import { useTheme } from '@mui/material';
//-----------------------------------------------------------------------------------------------------------------

export default function NilaiTipeWorksheet() {
  const theme = useTheme();

  return (
    <>
      <Stack direction={'row'} gap={2} marginBottom={4}>
        <div>
          <Iconify icon="solar:document-add-bold-duotone" color={theme.palette.grey[500]}/>
        </div>
        <div>
          <Typography fontWeight={600} variant="body2">{`Nilai Kertas Kerja PB :`}</Typography>
          <Typography variant='h6' color={theme.palette.primary.main}>
            90.25
          </Typography>
          <Typography variant="body3">
            Jumlah Checklist (26)
          </Typography>
          <br/>
          <Typography variant="body3">
            Jumlah Checklist Diisi (20)
          </Typography>
          <br/>
          <Typography variant="body3">
            Jumlah N/A (5)
          </Typography>
          <br/>
          <Typography variant="body3">
            Total skor (5)
          </Typography>
        </div>
      </Stack>
    </>
  )
}
