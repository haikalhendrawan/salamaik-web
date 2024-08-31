import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
// @mui
import {IconButton, Container, Grid, Stack, Typography} from '@mui/material';
// sections
import FollowUpCard from './components/FollowUpCard/FollowUpCard';
import FollowUpHeader from './components/FollowUpHeader';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useSnackbar from '../../hooks/display/useSnackbar';
import useLoading from '../../hooks/display/useLoading';
import { FindingsResponseType } from './types';
import PreviewFileModal from './components/PreviewFileModal';
import { PreviewFileModalProvider } from './usePreviewFileModal';
import { DialogProvider } from '../../hooks/display/useDialog';
import { WorksheetType } from '../worksheet/types';
// --------------------------------------------------------------


// --------------------------------------------------------------

export default function FollowUpDetail() {
  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const axiosJWT = useAxiosJWT();

  const kppnId= params.get('id');

  const [findings, setFindings] = useState<FindingsResponseType[] | []>([]);

  const [worksheet, setWorksheet] = useState<WorksheetType | null>(null);

  const selectedFindings = findings?.find((item) =>item?.id === Number(params.get('findingsId'))) || null;

  const getFindings = async() => {
    try{
      if(!kppnId){
        return 
      };

      const response = await axiosJWT.get(`/getFindingsByWorksheetId/${kppnId}`);
      setFindings(response.data.rows);

    }catch(err: any){
      setIsLoading(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  const getWorksheet = async() => {
    try{
      if(!kppnId){
        return null
      };

      const response = await axiosJWT.get(`/getWorksheetByPeriodAndKPPN/${kppnId}`);
      setWorksheet(response.data.rows);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFindings();
    getWorksheet();
  }, []);

  const today = new Date();
  const isPastClosePeriod = new Date(worksheet?.close_follow_up || '').getTime() < today?.getTime();

  return (
    <>
    <PreviewFileModalProvider>
      <DialogProvider>
        <Container maxWidth="xl">
            <Stack direction="row" justifyContent="start" spacing={1} sx={{mb: 5}}>
              <IconButton  
                onClick={() => navigate(-1)}
              >
                <Iconify icon={"eva:arrow-ios-back-outline"} />
              </IconButton> 

              <Typography variant="h4" >
                {`Tindak Lanjut Masalah #${findings?.findIndex((item) => item?.id === Number(params.get('findingsId'))) + 1}`}
              </Typography> 
            </Stack>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FollowUpHeader selectedFindings={selectedFindings} />
              </Grid>

              <Grid item xs={12}>
                <FollowUpCard findingResponse={selectedFindings} getData={getFindings} isDisabled={isPastClosePeriod}/>
              </Grid>
              
            </Grid>

            <PreviewFileModal getData={getFindings} isDisabled={isPastClosePeriod}/>

          </Container>
        </DialogProvider>
      </PreviewFileModalProvider>
    </>
  )

}