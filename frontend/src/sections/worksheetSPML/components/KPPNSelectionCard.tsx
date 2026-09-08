/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from 'react';
import { Link } from "react-router-dom";
import { isAxiosError } from 'axios';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import { generateExcelWorksheetSPML } from '../../excel/useExcelWorksheetSPML';
// @mui
import {Card, Box, CardHeader, Grow, Button, CircularProgress, Grid, Skeleton, Stack, Typography, Tooltip, IconButton} from '@mui/material';
import Iconify from '../../../components/iconify';
import useDictionary from '../../../hooks/useDictionary';
import useSnackbar from '../../../hooks/display/useSnackbar';
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
  worksheetSPMLId: string;
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
  worksheetSPMLId,
}: KPPNSelectionCardProps){
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const axiosJWT = useAxiosJWT();

  const {komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef} = useDictionary();

  const {openSnackbar} = useSnackbar();

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
    if (!komponenSpmlRef || !subKomponenSpmlRef || !aspekSpmlRef) {
      openSnackbar('Referensi worksheet SPML belum tersedia', 'error');
      return;
    }

    try {
      setIsExporting(true);
      const [junctionResponse, scoreResponse] = await Promise.all([
        axiosJWT.get(
          `/wsSPMLJunction/getWsSPMLJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
        ),
        axiosJWT.get(`/scoringEngine/spml/${encodeURIComponent(worksheetSPMLId)}`),
      ]);
      const rows = junctionResponse.data.rows;
      if (!rows?.length) {
        openSnackbar('Data worksheet SPML belum tersedia', 'error');
        return;
      }

      await generateExcelWorksheetSPML({
        rows,
        kppnName: header,
        komponenRef: komponenSpmlRef,
        subKomponenRef: subKomponenSpmlRef,
        aspekRef: aspekSpmlRef,
        spmlScore: scoreResponse.data.rows,
      });
      openSnackbar('Worksheet SPML berhasil diexport', 'success');
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error ? error.message : 'Gagal membuat file Excel SPML';
      openSnackbar(message, 'error');
    } finally {
      setIsExporting(false);
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
                  <span>
                    <IconButton
                      aria-label="Export worksheet SPML ke Excel"
                      onClick={handleGenerateExcel}
                      disabled={isExporting}
                      sx={{ cursor: isExporting ? 'default' : 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      {isExporting
                        ? <CircularProgress size={22} />
                        : <Iconify icon="vscode-icons:file-type-excel"/>}
                    </IconButton>
                  </span>
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
