/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from "react";
import { isAxiosError } from "axios";
import { Helmet } from 'react-helmet-async';
import {useAuth} from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosJWT from "../../hooks/useAxiosJWT";
import useWsSPMLJunction from "./useWsSPMLJunction";
// @mui
import { Grid, Container, Typography } from '@mui/material';
// sections
import KPPNSelectionCard from "./components/KPPNSelectionCard";
import { AllKPPNSPMLScoreType } from "./types";
import useSnackbar from "../../hooks/display/useSnackbar";
import useLoading from "../../hooks/display/useLoading";
// ----------------------------------------------------------------------
const KPPN_PICTURE = ['kppn-padang.png', 'kppn-bukittinggi.jpg', 'kppn-solok.jpg', 'kppn-lubuk-sikaping.jpg', 'kppn-sijunjung.jpg', 'kppn-painan.jpg' ];

// ----------------------------------------------------------------------
export default function WorksheetSPMLLanding() {
  const {auth} = useAuth();

  const { setWsSPMLJunction } = useWsSPMLJunction();

  const [spmlScores, setSpmlScores] = useState<AllKPPNSPMLScoreType[]>([]);

  const axiosJWT = useAxiosJWT();

  const navigate = useNavigate();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  useEffect(() => {
    setWsSPMLJunction([]);

    if (!auth?.kppn) return;
    if (auth.kppn.length !== 5) {
      setSpmlScores([]);
      navigate(`kppn?id=${auth?.kppn}`)
      return;
    }
    if (!auth.period) return;

    let active = true;
    const getScoreProgress = async () => {
      try {
        setIsLoading(true);
        const response = await axiosJWT.get(`/scoringEngine/spml/period/${auth.period}`);
        if (active) setSpmlScores(response.data.rows);
      } catch (err: unknown) {
        if (!active) return;
        setSpmlScores([]);
        const message = isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error ? err.message : 'Gagal mengambil skor SPML';
        openSnackbar(message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    getScoreProgress();
    return () => {
      active = false;
    };
    // Request/context functions are not memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.kppn, auth?.period, navigate]);

  return (
    <>
      <Helmet>
        <title> Salamaik | Worksheet  </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Kertas Kerja SPML
        </Typography>
        <Grid container spacing={4}>
          {
            spmlScores.map((item, index) => {
              const totalChecklist = item.detailKPPN.jumlahChecklist;
              const progressKanwil = item.detailKanwil.jumlahChecklistDiisi;
              const progressKPPN = item.detailKPPN.jumlahChecklistDiisi;
              const percentKanwil = totalChecklist > 0 ? (progressKanwil / totalChecklist) * 100 : 0;
              const percentKPPN = totalChecklist > 0 ? (progressKPPN / totalChecklist) * 100 : 0;
              return (
                <Grid item xs={12} md={6} key={item.worksheetSPMLId}>
                  <KPPNSelectionCard
                    header={item.alias}
                    lastUpdate=""
                    image={KPPN_PICTURE[index] || KPPN_PICTURE[0]}
                    link={`/worksheet/spml/kppn?id=${item.kppnId}`}
                    percentKanwil={percentKanwil}
                    percentKPPN={percentKPPN}
                    completedKPPN={progressKPPN}
                    totalChecklist={totalChecklist}
                    kppnId={item.kppnId}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </Container>
    </>
  );
}


