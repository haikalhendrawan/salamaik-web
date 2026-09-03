import { useMemo, useState } from 'react';
import { Box, Button, Divider, Drawer, Fab, Grid, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import { useAuth } from '../../../hooks/useAuth';
import formatOrderedTitle from '../../../utils/formatOrderedTitle';
import { WsCKJunctionType } from '../types';

const OpenButton = styled(Fab)({ borderRadius: '12px 0 0 12px' });
const CloseButton = styled(Button)({
  position: 'absolute', top: 150, left: -30, zIndex: 1, width: 30, minWidth: 30,
  minHeight: 34, padding: 0, borderRadius: '12px 0 0 12px',
});
const StatusBox = styled(Label)({
  width: 30, minWidth: 30, height: 26, border: '1px solid', cursor: 'pointer',
});

export default function NavigationDrawerCK({
  rows,
  onNavigate,
}: {
  rows: WsCKJunctionType[];
  onNavigate: (junctionId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const isKanwil = auth?.kppn?.length === 5;
  const groups = useMemo(() => {
    const map = new Map<number, WsCKJunctionType[]>();
    rows.forEach((row) => map.set(row.komponen_ck_id, [...(map.get(row.komponen_ck_id) || []), row]));
    return Array.from(map.values());
  }, [rows]);

  const navigate = (id: number) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      <Zoom in>
        <Tooltip title="Navigasi checklist CK" placement="left">
          <Box sx={{ position: 'fixed', bottom: 400, right: 0, zIndex: 1200 }}>
            <OpenButton color="primary" size="small" variant="extended" onClick={() => setOpen(true)}>
              <Iconify icon="lucide:chevron-left" />
            </OpenButton>
          </Box>
        </Tooltip>
      </Zoom>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 360, maxWidth: '90vw', p: 2, overflow: 'visible' } }}
      >
        <Tooltip title="Tutup" placement="left">
          <CloseButton variant="contained" size="small" onClick={() => setOpen(false)}>
            <Iconify icon="lucide:chevron-right" />
          </CloseButton>
        </Tooltip>
        <Typography variant="subtitle1" fontWeight={700}>Navigasi Kertas Kerja CK</Typography>
        <Typography variant="caption" color="text.secondary">{rows.length} checklist</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2} sx={{ overflowY: 'auto', pr: 1 }}>
          {groups.map((componentRows) => (
            <Box key={componentRows[0].komponen_ck_id}>
              <Typography variant="subtitle2" color="primary.main" mb={1}>
                {formatOrderedTitle(componentRows[0].komponen_urut, componentRows[0].komponen_title)}
              </Typography>
              <Grid container spacing={1}>
                {componentRows.map((row) => (
                  <Grid item key={row.junction_id}>
                    <Tooltip title={row.materi}>
                      <StatusBox color={statusColor(row, isKanwil)} onClick={() => navigate(row.junction_id)}>
                        {row.checklist_urut}
                      </StatusBox>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Legend color="pink" text="Belum diisi" />
          <Legend color="warning" text="Sudah diisi, nilai belum maksimal" />
          <Legend color="success" text="Nilai maksimal atau N/A" />
        </Stack>
      </Drawer>
    </>
  );
}

function statusColor(row: WsCKJunctionType, isKanwil: boolean): 'pink' | 'warning' | 'success' {
  if (row.excluded === 1) return 'success';
  const score = isKanwil ? row.kanwil_score : row.kppn_score;
  if (score === null) return 'pink';
  const maximum = Math.max(...(row.opsi || []).map((option) => option.value), 10);
  return score < maximum ? 'warning' : 'success';
}

function Legend({ color, text }: { color: 'pink' | 'warning' | 'success'; text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <StatusBox color={color} sx={{ cursor: 'default' }} />
      <Typography variant="caption">{text}</Typography>
    </Stack>
  );
}
