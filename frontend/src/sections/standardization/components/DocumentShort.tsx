import {useEffect, useState} from "react";
import {Card, Typography, Grid, CardHeader, CardContent, Button, Box} from '@mui/material';
import Iconify from "../../../components/iconify/Iconify";
import { PDFDownloadLink } from '@react-pdf/renderer';
import StdKPPNReportPDF from "../../PDF/StandardizationReport/StdKPPNReportPDF";
import useStandardization from "../useStandardization";
import useDictionary from "../../../hooks/useDictionary";
import { useAuth } from "../../../hooks/useAuth";
// ----------------------------------------------
interface DocumentShortProps {
  header: string,
  subheader: string,
  image: string,
  tabValue: string
};
// ----------------------------------------------

export default function DocumentShort({header, subheader, image, tabValue }:DocumentShortProps){
  const [loading, setLoading] = useState<boolean>(false);
  
  const {standardization} = useStandardization();

  const {auth} = useAuth();

  const {periodRef} = useDictionary();

  useEffect(() => {
    async function refresh(){
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); 
    }

    refresh()
  },[tabValue])

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardHeader 
        title={<Typography variant="subtitle2">{header}</Typography>} 
        subheader={subheader} 
      />
      <CardContent>
        <Grid container spacing={1} sx={{height: '100%'}}>
          <Grid item xs={4} key={0} sx={{height: '100%'}}>
            <PDFDownloadLink 
              document={<StdKPPNReportPDF
                          period={auth?.period} 
                          periodRef={periodRef} 
                          standardization={standardization}
                          unitName={subheader}
                          kppn={auth?.kppn}
                        />} 
              fileName={'standardisasi-kppn'}
            >
              <Button 
                variant='contained' 
                size='small'
                endIcon={<Iconify icon="solar:printer-2-bold-duotone" />} 
                sx={{mt: 6}}
                disabled={loading}
              >
                Print
              </Button>
            </ PDFDownloadLink>
            
          </Grid>

          <Grid item xs={8} key={1} sx={{height: '100%'}}>
            <Box sx={{justifyContent:'center', maxWidth:'100%'}} dir="ltr" >
              <img src={image} style={{maxWidth:'100%', margin: 'auto', marginTop: -70, marginLeft: 30}} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
