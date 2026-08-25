import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Fab,
  Grid,
  Stack,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Scrollbar from '../../../components/scrollbar';
import useDictionary from '../../../hooks/useDictionary';
import { useAuth } from '../../../hooks/useAuth';
import { WsSPMLJunctionType } from '../types';
import formatOrderedTitle from '../../../utils/formatOrderedTitle';

interface NavigationDrawerSPMLProps {
  wsSPMLJunction: WsSPMLJunctionType[];
  scrollToChecklist: (junctionId: number) => void;
}

const StyledFab = styled(Fab)({
  borderRadius: '12px 0 0 12px',
});

const StatusBox = styled(Label)({
  width: 22,
  minWidth: 22,
  height: 22,
  border: '1px solid',
  cursor: 'pointer',
});

const DrawerCloseButton = styled(Button)({
  position: 'absolute',
  top: 150,
  left: -30,
  zIndex: 1,
  width: 30,
  minWidth: 30,
  minHeight: 34,
  padding: 0,
  borderRadius: '12px 0 0 12px',
});

export default function NavigationDrawerSPML({
  wsSPMLJunction,
  scrollToChecklist,
}: NavigationDrawerSPMLProps) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const { komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef } = useDictionary();
  const isKanwil = auth?.kppn?.length === 5;

  const checklistCount = useMemo(() => wsSPMLJunction.length, [wsSPMLJunction]);
  const aspekCount = useMemo(() => aspekSpmlRef?.length || 0,[aspekSpmlRef]);

  const handleNavigate = (junctionId: number) => {
    scrollToChecklist(junctionId);
    setOpen(false);
  };

  return (
    <>
      <Zoom in>
        <Tooltip title="Navigasi checklist" placement="left">
          <Box sx={{ position: 'fixed', bottom: 400, right: 0, zIndex: 1200 }}>
            <StyledFab
              color="primary"
              size="small"
              variant="extended"
              aria-label="Buka navigasi checklist SPML"
              onClick={() => setOpen(true)}
            >
              <Iconify icon="lucide:chevron-left" />
            </StyledFab>
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
          <DrawerCloseButton
            variant="contained"
            size="small"
            aria-label="Tutup navigasi checklist SPML"
            onClick={() => setOpen(false)}
          >
            <Iconify icon="lucide:chevron-right" />
          </DrawerCloseButton>
        </Tooltip>

        <Stack direction="row" alignItems="center" mb={1}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Navigasi Kertas Kerja SPML
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {aspekCount} aspek, {checklistCount} checklist
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Scrollbar sx={{ flexGrow: 1, minHeight: 0 }}>
          <Stack spacing={2} pr={1}>
            {komponenSpmlRef?.map((komponen) => {
              const componentRows = wsSPMLJunction.filter(
                (item) => item.komponen_spml_id === komponen.id
              );
              if (componentRows.length === 0) return null;

              return (
                <Box key={komponen.id}>
                  <Typography variant="subtitle2" color="primary.main" mb={1}>
                    {formatOrderedTitle(komponen.urut, komponen.title)}
                  </Typography>

                  <Stack spacing={1.5}>
                    {subKomponenSpmlRef
                      ?.filter((subKomponen) => subKomponen.komponen_spml_id === komponen.id)
                      .map((subKomponen) => {
                        const subComponentRows = componentRows.filter(
                          (item) => item.subkomponen_spml_id === subKomponen.id
                        );
                        if (subComponentRows.length === 0) return null;

                        return (
                          <Box key={subKomponen.id}>
                            <Box
                              sx={{
                                p: 1,
                                mb: 1,
                                borderRadius: 2,
                                bgcolor: 'grey.200',
                                color: 'common.black',
                              }}
                            >
                              <Typography variant="caption">
                                {formatOrderedTitle(subKomponen.urut, subKomponen.title)}
                              </Typography>
                            </Box>

                            <Grid container spacing={1.5}>
                              {aspekSpmlRef
                                ?.filter((aspek) => aspek.subkomponen_spml_id === subKomponen.id)
                                .map((aspek) => {
                                  const aspectRows = subComponentRows.filter(
                                    (item) => item.aspek_spml_id === aspek.id
                                  );
                                  if (aspectRows.length === 0) return null;

                                  return (
                                    <Grid item xs={4} key={aspek.id}>
                                      <Stack alignItems="center" spacing={0.5}>
                                        <Typography variant="caption" fontWeight="bold">
                                          {`${aspek.urut}${aspek.urut_huruf || ''}`}
                                        </Typography>
                                        <Stack
                                          direction="row"
                                          spacing={0.5}
                                          useFlexGap
                                          flexWrap="wrap"
                                          justifyContent="center"
                                        >
                                          {aspectRows.map((junction) => (
                                            <Tooltip
                                              key={junction.junction_id}
                                              title={junction.uraian}
                                              placement="top"
                                            >
                                              <span>
                                                <StatusBox
                                                  color={getStatusColor(junction, isKanwil)}
                                                  onClick={() => handleNavigate(junction.junction_id)}
                                                />
                                              </span>
                                            </Tooltip>
                                          ))}
                                        </Stack>
                                      </Stack>
                                    </Grid>
                                  );
                                })}
                            </Grid>
                          </Box>
                        );
                      })}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Scrollbar>

        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Legend color="pink" text="Belum diisi" />
          <Legend color="warning" text="Sudah diisi, nilai belum maksimal" />
          <Legend color="success" text="Sudah diisi, nilai maksimal atau N/A" />
        </Stack>
      </Drawer>
    </>
  );
}

function Legend({ color, text }: { color: 'pink' | 'warning' | 'success'; text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <StatusBox color={color} sx={{ cursor: 'default' }} />
      <Typography variant="caption">{text}</Typography>
    </Stack>
  );
}

function getStatusColor(junction: WsSPMLJunctionType, isKanwil: boolean) {
  if (junction.excluded === 1) return 'success';

  const score = isKanwil ? junction.kanwil_score : junction.kppn_score;
  if (score === null) return 'pink';
  if (score < 10) return 'warning';
  return 'success';
}
