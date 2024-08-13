import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Grid} from '@mui/material';
import {useTheme} from '@mui/material/styles';
// sections
import FollowUpProgress from './components/FollowUpProgress';
import AmountTemuan from './components/AmountTemuan';
import FollowUpPeriod from './components/FollowUpPeriod';
import FollowUpTable from './components/FollowUpTable';
import SelectionTab from './components/SelectionTab';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useSnackbar from '../../hooks/display/useSnackbar';
import useLoading from '../../hooks/display/useLoading';
import {useAuth} from '../../hooks/useAuth';
import useDictionary from '../../hooks/useDictionary';
import { FindingsResponseType } from './types';
import { WorksheetType } from '../worksheet/types';
// --------------------------------------------------------------


// --------------------------------------------------------------
export default function FollowUpKPPN() {
  const theme = useTheme();

  const params = new URLSearchParams(useLocation().search);

  const navigate = useNavigate();

  const {auth} = useAuth();

  const {kppnRef, periodRef} = useDictionary();

  const isKanwil = auth?.kppn === '03010';

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const axiosJWT = useAxiosJWT();

  const kppnId= params.get('id');

  const kppnName = kppnRef?.list.filter((item) => item.id === kppnId)[0]?.alias || ''

  const [findings, setFindings] = useState<FindingsResponseType[] | []>([]);

  const [worksheet, setWorksheet] = useState<WorksheetType | null>(null);

  const [tabValue, setTabValue] = useState('010'); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => { // setiap tab komponen berubah
    setTabValue(newValue);
    navigate(`?id=${newValue}`);
  };

  const getFindings = async() => {
    try{
      if(!kppnId){
        return null
      };

      const response = await axiosJWT.get(`/getFindingsByWorksheetId/${kppnId}`);
      setFindings(response.data.rows);

      console.log(response.data.rows);

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
      console.log(response.data.rows);

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

  const getData = () =>{
    const id = params.get('id');

    if(!id){
      navigate(`?id=010`);
    };

    if (id !== tabValue) {
      setTabValue(id || '010'); // Sync tabValue with URL on location change
    };

    getFindings();
    getWorksheet();
  };

  const totalFindingsNonFinal = findings?.length;
  const totalFindingsFinal = findings?.filter((f) => f?.status === (0 | 1 | 2)).length;
  const countFindingsOnProgress = findings?.filter((f) => f?.status === 1).length;
  const findingsPercentProgress = (countFindingsOnProgress / totalFindingsNonFinal) * 100;

  const semester = periodRef?.list?.filter((item) => item.id === auth?.period)[0]?.semester || '';
  const year = periodRef?.list?.filter((item) => item.id === auth?.period)[0]?.tahun || '';

  const today = new Date();
  const isPastClosePeriod = new Date(worksheet?.close_follow_up || '').getTime() < today.getTime();
  const isFinalText = isPastClosePeriod ? 'Final' : 'Non-Final';

  useEffect(() => {
    getData();
  }, [location.search, tabValue]);

  return (
    <>
      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} sx={{mb: 5}} maxWidth={'100%'}>
          <Typography variant="h4">
            {`Tindak Lanjut`}
          </Typography>
        </Stack>

        <SelectionTab tab={tabValue} changeTab={handleTabChange} />

        <Stack direction='row'>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <AmountTemuan
                header={`Jumlah Permasalahan ${kppnName}`}
                subheader={`Semester ${semester} ${year} (${isFinalText})`}
                temuan={isPastClosePeriod ? totalFindingsFinal : totalFindingsNonFinal}
              />
            </Grid>
            <Grid item xs={4}>
              <FollowUpProgress
                header={`Progress Tindak Lanjut`}
                number={findingsPercentProgress}
                footer={kppnName}
                detail={`${countFindingsOnProgress}/${totalFindingsNonFinal}`}
                icon={`mdi:cash-register`}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={4}>
              <FollowUpPeriod
                header={`Periode Tindak Lanjut`}
                open={worksheet?.open_follow_up || ''}
                close={worksheet?.close_follow_up || ''}
              />
            </Grid>

            <Grid item xs={12}>
              <FollowUpTable findings={findings} kppnId={kppnId} />
            </Grid>

          </Grid>
        </Stack>
      </Container>
    </>
  )

}