import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container} from '@mui/material';
import { useAuth } from "../hooks/useAuth";
import useAxiosJWT from '../hooks/useAxiosJWT';
import useSnackbar from '../hooks/display/useSnackbar';
// sections
import WelcomeCard from "../sections/home/components/WelcomeCard";
import PhotoGallery from "../sections/home/components/PhotoGallery";
import KanwilView from "../sections/home/KanwilView";
import KPPNView from "../sections/home/KPPNView";
import { MiscType } from './admin/GalleryInterfacePage';
// ----------------------------------------------------------------------

export default function HomePage() {
  const {auth} = useAuth();

  const [gallery, setGallery] = useState<string[] | []>([]);

  const isKanwil = auth?.kppn === '03010';

  const username = auth?.name;

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const getGallery = async () => {
    try{
      const miscTypeGallery = 3;
      const response = await axiosJWT.get(`/getMiscByType/${miscTypeGallery}`);
      const galleryArray: string[] = response?.data?.rows?.map((item: MiscType) => item.value)
      setGallery(galleryArray);
    }catch(err: any){
      openSnackbar(err?.response?.data?.message, 'error');
    }
  };

  useEffect(() => {
    getGallery();
  }, [])

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
              images={gallery}
              height={'300px'} 
            /> 
          </Grid>

          {isKanwil?<KanwilView />:<KPPNView />}

        </Grid>
      </Container>
    </>
  );
}


