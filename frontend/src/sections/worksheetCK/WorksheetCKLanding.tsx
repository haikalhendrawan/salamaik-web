import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import useWsCKJunction from './useWsCKJunction';
import { CKProgressType } from './types';
import KPPNSelectionCardCK from './components/KPPNSelectionCardCK';

const KPPN_PICTURES = ['kppn-padang.png', 'kppn-bukittinggi.jpg', 'kppn-solok.jpg', 'kppn-lubuk-sikaping.jpg', 'kppn-sijunjung.jpg', 'kppn-painan.jpg'];

export default function WorksheetCKLanding() {
  const { auth } = useAuth();
  const axiosJWT = useAxiosJWT();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const { setWsCKJunction } = useWsCKJunction();
  const [progress, setProgress] = useState<CKProgressType[]>([]);

  useEffect(() => {
    setWsCKJunction([]);
    if (!auth?.kppn) return;
    if (auth.kppn.length !== 5) {
      navigate(`kppn?id=${auth.kppn}`);
      return;
    }

    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await axiosJWT.get(`/wsCKJunction/getProgressAllKPPN?time=${Date.now()}`);
        if (active) setProgress(response.data.rows);
      } catch (error: unknown) {
        if (!active) return;
        const message = isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error ? error.message : 'Gagal mengambil progress CK';
        openSnackbar(message, 'error');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => { active = false; };
    // Context functions are not memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.kppn, auth?.period, navigate]);

  return (
    <>
      <Helmet><title>Salamaik | Worksheet CK</title></Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>Kertas Kerja CK</Typography>
        <Grid container spacing={4}>
          {progress.map((item, index) => (
            <Grid item xs={12} md={6} key={item.worksheetCKId}>
              <KPPNSelectionCardCK
                header={item.alias}
                image={KPPN_PICTURES[index] || KPPN_PICTURES[0]}
                link={`/worksheet/ck/kppn?id=${item.kppnId}`}
                completedKPPN={item.jumlahChecklistDiisiKPPN}
                completedKanwil={item.jumlahChecklistDiisiKanwil}
                total={item.jumlahChecklist}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
