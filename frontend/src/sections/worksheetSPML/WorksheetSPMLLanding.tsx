/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from "react";
import { Helmet } from 'react-helmet-async';
import {useAuth} from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosJWT from "../../hooks/useAxiosJWT";
// @mui
import { Grid, Container, Typography } from '@mui/material';
// sections
import KPPNSelectionCard from "./components/KPPNSelectionCard";
import { KPPNScoreProgressResponseType } from "../home/types";
import useSnackbar from "../../hooks/display/useSnackbar";
import useLoading from "../../hooks/display/useLoading";
// ----------------------------------------------------------------------
const KPPN_PICTURE = ['kppn-padang.png', 'kppn-bukittinggi.jpg', 'kppn-solok.jpg', 'kppn-lubuk-sikaping.jpg', 'kppn-sijunjung.jpg', 'kppn-painan.jpg' ];

// ----------------------------------------------------------------------
export default function WorksheetSPMLLanding() {
  const {auth} = useAuth();

  const [wsDetail, setWsDetail] = useState<KPPNScoreProgressResponseType[] | null>(null);

  const axiosJWT = useAxiosJWT();

  const navigate = useNavigate();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const getScoreProgress = async() => {
    try{
      setIsLoading(true);
      if(auth?.kppn?.length!==5){
        return setIsLoading(false);
      }
      const response = await axiosJWT.get('/getWsJunctionScoreAndProgressAllKPPN');
      setWsDetail(response.data.rows);
      setIsLoading(false);
    }catch(err:any){
      setIsLoading(false);
      openSnackbar(err?.response?.data?.message, 'error');
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getScoreProgress();
  }, []);

  if(auth?.kppn?.length !== 5 ){
    navigate(`kppn?id=${auth?.kppn}`)
  };

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
            wsDetail?.map((item, index) => {
              const progressKanwil = item?.scoreProgressDetail?.totalProgressKanwil || 0;
              const progressKPPN = item?.scoreProgressDetail?.totalProgressKPPN || 0;
              const totalChecklist = item?.scoreProgressDetail?.totalChecklist || 0;
              const percentKanwil = (progressKanwil / totalChecklist * 100) || 0;
              const percentKPPN = (progressKPPN / totalChecklist * 100) || 0;
              return (
                <Grid item xs={12} md={6} key={index}>
                  <KPPNSelectionCard
                    header={item?.alias}
                    lastUpdate="Last Update: Apr 12, 2022"
                    image={KPPN_PICTURE[index]}
                    link={`/worksheet/spml/kppn?id=${item?.id}`}
                    percentKanwil={percentKanwil}
                    percentKPPN={percentKPPN}
                    kppnId={item?.id}
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


