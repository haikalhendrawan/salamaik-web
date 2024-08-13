import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container} from '@mui/material';
import { useAuth } from "../hooks/useAuth";
// sections
import WelcomeCard from "../sections/home/components/WelcomeCard";
import PhotoGallery from "../sections/home/components/PhotoGallery";
import KanwilView from "../sections/home/KanwilView";
import KPPNView from "../sections/home/KPPNView";
// ----------------------------------------------------------------------

export default function HomePage() {
  const {auth} = useAuth();

  const isKanwil = auth?.kppn === '03010';

  const username = auth?.name

  return (
    <>
      <Helmet>
        <title> Salamaik | Home  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
           <WelcomeCard title={`Welcome, ${username}`} total={10} icon="eva:home-outline" />
          </Grid>

          <Grid item xs={12} md={4}>
            <PhotoGallery 
              title='Galeri Salamaik' 
              images={['01.jpg', '02.jpg', '03.jpg', '04.jpeg', '05.jpeg']}
              height={'300px'} 
            /> 
          </Grid>

          {isKanwil?<KanwilView />:<KPPNView />}

        </Grid>
      </Container>
    </>
  );
}


