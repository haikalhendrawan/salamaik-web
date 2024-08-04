import {useEffect} from "react";
import { Helmet } from 'react-helmet-async';
import useWsJunction from "./useWsJunction";
// @mui
import { Grid, Container, Typography } from '@mui/material';
// sections
import KPPNSelectionCard from "./component/KPPNSelectionCard";
// ----------------------------------------------------------------------

export default function WorksheetLanding() {
  const { setWsJunction} = useWsJunction();

  useEffect(() => {
    setWsJunction([]);
  }, []);

  return (
    <>
      <Helmet>
        <title> Salamaik | Worksheet  </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Kertas Kerja
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <KPPNSelectionCard
              header='KPPN Padang'
              subheader='67% complete'
              lastUpdate="Last Update: Apr 12, 2022"
              image='kppn-padang.png'
              link={`/worksheet/kppn?id=010`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KPPNSelectionCard
              header='KPPN Bukittinggi'
              subheader='24% complete'
              lastUpdate="Last Update: Mei 19, 2022"
              image='kppn-bukittinggi.jpg'
              link={`/worksheet/kppn?id=011`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KPPNSelectionCard
              header='KPPN Solok'
              subheader='100% complete'
              lastUpdate="Last Update: Apr 16, 2022"
              image='kppn-solok.jpg'
              link={`/worksheet/kppn?id=090`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KPPNSelectionCard
              header='KPPN Lubuk Sikaping'
              subheader='5% complete'
              lastUpdate="Last Update: Mei 12, 2022"
              image='kppn-lubuk-sikaping.jpg'
              link={`/worksheet/kppn?id=091`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KPPNSelectionCard
              header='KPPN Sijunjung'
              subheader='88% complete'
              lastUpdate="Apr 12, 2022"
              image='kppn-sijunjung.jpg'
              link={`/worksheet/kppn?id=077`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KPPNSelectionCard
              header='KPPN Painan'
              subheader='12% complete'
              lastUpdate="Apr 12, 2022"
              image='kppn-painan.jpg'
              link={`/worksheet/kppn?id=142`}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


