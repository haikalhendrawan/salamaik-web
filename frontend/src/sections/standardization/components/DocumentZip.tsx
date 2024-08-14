import {useEffect, useState} from "react";
import {Card, Typography, Grid, CardHeader, CardContent, Button, Box, Container, Stack} from '@mui/material';
import Iconify from "../../../components/iconify/Iconify";
import useStandardization from "../useStandardization";
import useDictionary from "../../../hooks/useDictionary";
import useAxiosJWT from "../../../hooks/useAxiosJWT";
import useLoading from "../../../hooks/display/useLoading";
import useSnackbar from "../../../hooks/display/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
// ----------------------------------------------
interface DocumentShortProps {
  header: string,
  subheader: string,
  image: string,
  tabValue: string
};
// ----------------------------------------------

export default function DocumentZip({header, subheader, image, tabValue }:DocumentShortProps){
  const [loading, setLoading] = useState<boolean>(false);
  
  const {standardization} = useStandardization();

  const {auth} = useAuth();

  const {periodRef, kppnRef} = useDictionary();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  useEffect(() => {
    async function refresh(){
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); 
    }

    refresh()
  },[tabValue]);

  const handleDownloadFile = async () => {
    try {
      const kppnId = tabValue;
      const month = 1;
      const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const monthString = monthName[month-1];
      const kppnString = kppnRef?.list?.filter((item) => item.id === kppnId)[0]?.alias || '';
      const year = periodRef?.list?.filter((item) => item.id === auth?.period)[0]?.tahun || 0;
      const response = await axiosJWT.post('/getStdFilePerMonthKPPN', {
        kppnId,
        month
      }, {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${kppnString}-${monthString}-${year}.zip`); 
      document.body.appendChild(link);
      link.click();
  
      window.URL.revokeObjectURL(url);
  
    } catch (err: any) {
      openSnackbar(err.message, 'error');
    }
  };

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <Grid container spacing={0}>
        
        <Grid item xs={6}>
          <CardHeader title={header}  subheader={subheader} titleTypographyProps={{variant:'subtitle2'}} /> 
          <Box sx={{ p: 3, pb: 2 }} dir="ltr">
            <Grid container direction="row" sx={{ justifyContent: 'start', alignItems: 'end'}}>
                <Button 
                  variant='contained' 
                  size='small'
                  endIcon={<Iconify icon="solar:download-bold" />} 
                  disabled={loading}
                  sx={{mt: 2}}
                  onClick={handleDownloadFile}
                >
                  Zip
                </Button>
            </Grid>                      
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ overflow:'hidden',  display:'flex', height:'100%', width:'100%', background:'cover', alignContent: 'center', alignItems: 'center'}}>
            <img src={image}  style={{ maxHeight:'100%', width: '90%', borderRadius:'12px'}}  />
          </Box>
        </Grid>

      </Grid>
    </Card>
  )
}
