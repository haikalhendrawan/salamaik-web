/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from 'react';
import { Link } from "react-router-dom";
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useExcelWorksheet from '../../excel/useExcelWorksheet';
import useExcelWorksheet2 from '../../excel/useExcelWorksheet2';
// @mui
import {Card, Box, CardHeader, Grow, Button,  Grid,  Skeleton, Stack, Typography, Tooltip, IconButton} from '@mui/material';
import Iconify from '../../../components/iconify';
import useDictionary from '../../../hooks/useDictionary';
import { useAuth } from '../../../hooks/useAuth';
// -----------------------------------------------------------------------
interface KPPNSelectionCardProps{
  header: string;
  lastUpdate: string;
  image: string;
  link: string;
  percentKanwil: number;
  percentKPPN: number;
  completedKPPN: number;
  totalChecklist: number;
  kppnId: string;
}
// -----------------------------------------------------------------------
export default function KPPNSelectionCard({
  header,
  image,
  link,
  percentKanwil,
  percentKPPN,
  completedKPPN,
  totalChecklist,
  kppnId,
}: KPPNSelectionCardProps){
  const [imageLoaded, setImageLoaded] = useState(false);

  const axiosJWT = useAxiosJWT();

  const {komponenRef, subKomponenRef} = useDictionary();

  const {auth} = useAuth();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const subheader = (
    <Stack direction='row' spacing={1}> 
      <Typography variant='body3'>{`${percentKanwil.toFixed(0)}% complete`}</Typography>
      <Tooltip title={`Progress pengisian mandiri oleh KPPN: ${completedKPPN}/${totalChecklist} (${percentKPPN.toFixed(0)}%)`}>
        <Iconify icon={"solar:info-circle-bold-duotone"}  sx={{borderRadius:'50%', cursor: 'pointer'}} />
      </Tooltip> 
    </Stack>
  );

  async function handleGenerateExcel() {
    try {
      const response = await axiosJWT.get(
        `/getWsJunctionByWorksheetForKanwil?kppn=${kppnId}&time=${new Date().getTime()}`
      );
      const response2 = await axiosJWT.post(`/getWsJunctionScoreAndProgress`, {kppnId, period: auth?.period});

      const rows = response.data.rows;
      const matrixScore = response2.data.rows;

      const excelWorksheet = useExcelWorksheet(rows, matrixScore, komponenRef, subKomponenRef);
      const excelWorksheet2 = useExcelWorksheet2(rows, header, komponenRef, subKomponenRef);
      const peraturan1 = auth?.peraturan === 1;
      peraturan1 ? await excelWorksheet.generate() :await excelWorksheet2.generate();
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  }
  

  return(
    <Grow in>
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
                <Tooltip title="export excel">
                  <IconButton onClick={handleGenerateExcel}>
                    <Iconify icon="vscode-icons:file-type-excel"/>
                  </IconButton>
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
    </Grow>
  )
}
