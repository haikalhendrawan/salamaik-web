import { Box, Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';

const ReferenceContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  borderRadius: '12px',
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

interface WorksheetCkGridProps {
  changeSection: (section: number) => void;
}

const references = [
  { title: 'Komponen CK', section: 12 },
  { title: 'Checklist CK', section: 13 },
];

export default function WorksheetCkGrid({ changeSection }: WorksheetCkGridProps) {
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      alignItems="start"
      justifyContent="center"
      sx={{ p: 3, pb: 0 }}
    >
      <Grid item xs={12} sm={4} md={4}>
        <Typography variant="h6">Kertas Kerja CK</Typography>
        <Typography variant="body3">Atur referensi Kertas Kerja Capaian Kinerja.</Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={8}>
        <ReferenceContainer>
          {references.map((reference) => (
            <Grid container key={reference.section} alignItems="center" spacing={1}>
              <Grid item xs={7} md={6}>
                <Typography variant="body2">{reference.title}</Typography>
              </Grid>
              <Grid item xs={5} md={6}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                  onClick={() => changeSection(reference.section)}
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
          ))}
        </ReferenceContainer>
      </Grid>
    </Grid>
  );
}
