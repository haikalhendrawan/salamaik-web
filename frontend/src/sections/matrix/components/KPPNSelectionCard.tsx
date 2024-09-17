/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from 'react';
import { Link } from "react-router-dom";
// @mui
import {Card, Box, CardHeader,  Button,  Grid, IconButton, Tooltip, Skeleton} from '@mui/material';
import Iconify from '../../../components/iconify';
// -----------------------------------------------------------------------
interface KPPNSelectionCardProps{
  header: string;
  subheader: string;
  lastUpdate: string;
  image: string;
  link: string;
};
// -----------------------------------------------------------------------
export default function KPPNSelectionCard({header, subheader, lastUpdate, image, link}: KPPNSelectionCardProps){
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return(
    <Card>
      <Grid container spacing={0}>
      
        <Grid item xs={6}>
          <CardHeader title={header}  subheader={subheader} titleTypographyProps={{variant:'subtitle1'}} /> 
          <Box sx={{ p: 3, pb: 2 }} dir="ltr">
            <Grid container direction="row" sx={{ mt:12, justifyContent: 'space-between' }}>
              <Button 
                variant='contained'
                color='primary'
                endIcon={<Iconify icon="solar:book-2-bold-duotone" />}
                component={Link} 
                to={link}
              >
                Open
              </Button> 
              <Tooltip title={lastUpdate}>
                {lastUpdate?
                <IconButton disableRipple><Iconify icon={"solar:check-circle-bold"}  sx={{borderRadius:'50%', color: 'rgb(0, 167, 111)' }} /></IconButton>
                :<IconButton disableRipple sx={{display:'none'}}><Iconify icon={"solar:check-circle-bold"} sx={{borderRadius:'50%'}} /></IconButton>}
              </Tooltip> 
            </Grid>                      
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ overflow:'hidden', pl:0, pt:3, pr:2, pb: 2, display:'flex', height:'100%', width:'100%', background:'cover', alignContent: 'center', alignItems: 'center'}}>
          {
            imageLoaded
            ? null
            :<Skeleton variant="rounded" sx={{position:'absolute', width:'250px', height:'220px'}} />
          }
          <img 
            src={`/image/${image}`} 
            style={{ height:'220px', width: '100%', borderRadius:'12px'}} 
            onLoad={handleImageLoad}
          />
          </Box>
        </Grid>

      </Grid>
    </Card>
  )
}