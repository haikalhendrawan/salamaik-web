import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Grid } from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import useDictionary from '../../hooks/useDictionary';
import { useAuth } from '../../hooks/useAuth';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
// sections
import ScorePembinaan from '../home/components/ScorePembinaan';
import ProgressPembinaan from '../home/components/ProgressPembinaan';
import RekapitulasiNilaiTable from './components/RekapitulasiNilaiTable';
import MatrixGateway from './components/MatrixGateway';
import SelectionTab from './components/SelectionTab';
import { MatrixScoreAndProgressType } from './types';
// --------------------------------------------------------------


// --------------------------------------------------------------
export default function MatrixKPPN() {
  const theme = useTheme();

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);

  const kppnId = params.get('id');

  const {kppnRef} = useDictionary();
  
  const {auth} = useAuth();

  const isKanwil = auth?.kppn === '03010';

  const payloadKPPN = auth?.kppn || '';

  const defaultTab = isKanwil? '010': payloadKPPN;

  const {setIsLoading} = useLoading();

  const { openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [matrixScore, setMatrixScore] = useState<MatrixScoreAndProgressType | null>(null);

  const [tabValue, setTabValue] = useState(defaultTab); // ganti menu komponen supervisi

  const kppnName = kppnRef?.list.filter((item) => item.id === kppnId)[0]?.alias || ''

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => { // setiap tab komponen berubah
    setTabValue(newValue);
    navigate(`?id=${newValue}`);
    setMatrixScore(null);
  };

  const getMatrixScoreAndProgress = async() => {
    try{
      if(!kppnId){
        return null
      };
      
      const response = await axiosJWT.post(`/getWsJunctionScoreAndProgress`, {kppnId: kppnId, period: auth?.period});
      setMatrixScore(response.data.rows);
      console.log(response.data.rows)
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
    if(!kppnId){
      navigate(`?id=${defaultTab}`);
    };

    if(!isKanwil){
      navigate(`?id=${defaultTab}`);
    }

    if (kppnId !== tabValue) {
      setTabValue(kppnId || '010'); // Sync tabValue with URL on location change
    };

    getMatrixScoreAndProgress();
  }, [location.search, tabValue]);


  const totalChecklist = matrixScore?.totalChecklist || 0;
  const countProgress = isKanwil ? ((matrixScore?.totalProgressKanwil) || 0 ): ((matrixScore?.totalProgressKPPN) || 0 );
  const progressPercentPembinaan = ((countProgress/totalChecklist) * 100) || 0; 


  return (
    <>
      <Helmet>
        <title> Salamaik | Matrix </title>
      </Helmet>
      
      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} sx={{mb: 5}} maxWidth={'100%'}>
          <Typography variant="h4">
            {`Matriks`}
          </Typography>
        </Stack>

        <SelectionTab tab={tabValue} changeTab={handleTabChange}/>
        
        <Stack direction='row'>
          <Grid container spacing={4}>
            <Grid item xs={5}>
              <Stack direction='column' spacing={2}>
                <ScorePembinaan
                  header={`Nlai Kinerja ${kppnName}`}
                  selfScore={matrixScore?.scoreByKPPN || 0}
                  kanwilScore={matrixScore?.scoreByKanwil || 0} 
                />
                <ProgressPembinaan 
                  header={`Progress Kertas Kerja`}
                  number={progressPercentPembinaan}
                  footer={kppnName}
                  detail={`${countProgress}/${totalChecklist}`}
                  icon={`mdi:cash-register`}
                  color={theme.palette.primary.main}
                />
              </Stack>
            
            </Grid>
            <Grid item xs={7}>
              <MatrixGateway
                title={`Detail Matriks ${kppnName}`}
                subheader='Lihat matriks Pembinaan dan Supervisi' 
              />
            </Grid>

            <Grid item xs={12}>
              <RekapitulasiNilaiTable matrixScore={matrixScore} kppnName={kppnName}/>
            </Grid>
          </Grid>
          
          
        </Stack>
      </Container>
      
    </>
  )

}