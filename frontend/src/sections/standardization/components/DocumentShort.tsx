/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useEffect, useState} from "react";
import {Card, Grid, CardHeader, Button, Box} from '@mui/material';
import Iconify from "../../../components/iconify/Iconify";
import { PDFDownloadLink } from '@react-pdf/renderer';
import StdKPPNReportPDF from "../../PDF/StandardizationReport/StdKPPNReportPDF";
import useStandardization from "../useStandardization";
import useDictionary from "../../../hooks/useDictionary";
import { useAuth } from "../../../hooks/useAuth";
import useAxiosJWT from "../../../hooks/useAxiosJWT";
// ----------------------------------------------
interface DocumentShortProps {
  header: string,
  subheader: string,
  image: string,
  tabValue?: string
};
// ----------------------------------------------

export default function DocumentShort({header, subheader, image, tabValue }:DocumentShortProps){
  const [loading, setLoading] = useState<boolean>(false);

  const [kabid, setKabid] = useState<string>('');
  
  const {standardization} = useStandardization();

  const {auth} = useAuth();

  const {periodRef} = useDictionary();

  const axiosJWT = useAxiosJWT();

  const getDataKabid = async () => {
    try{
      const dataKabidId = 1;
      const response = await axiosJWT.get(`/getMiscByType/${dataKabidId}`);
      setKabid(response?.data?.rows?.[0]?.value || '');
    }catch(err: any){
      console.log(err);
    }
  };

  useEffect(() => {
    async function refresh(){
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); 
    }

    refresh();
    getDataKabid();
  },[tabValue])

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <Grid container spacing={0}>
        
        <Grid item xs={6}>
          <CardHeader title={header}  subheader={subheader} titleTypographyProps={{variant:'subtitle2'}} /> 
          <Box sx={{ p: 3, pb: 2 }} dir="ltr">
            <Grid container direction="row" sx={{ justifyContent: 'start', alignItems: 'end'}}>
              <PDFDownloadLink 
                document={<StdKPPNReportPDF
                            period={auth?.period} 
                            periodRef={periodRef} 
                            standardization={standardization}
                            unitName={subheader}
                            kppn={auth?.kppn}
                            kabid={kabid}
                          />} 
                fileName={'standardisasi-kppn'}
              >
                <Button 
                  variant='contained' 
                  size='small'
                  endIcon={<Iconify icon="solar:printer-2-bold-duotone" />} 
                  disabled={loading}
                  sx={{mt: 2}}
                >
                  Print
                </Button>
              </ PDFDownloadLink>

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
