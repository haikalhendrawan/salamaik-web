import {useEffect, useMemo, useState} from "react";
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Skeleton } from '@mui/material';
// sections
import ProgressPembinaan from "./components/ProgressPembinaan";
import ScoreHistory from "./components/ScoreHistory";
import ProgressHorizontal from "./components/ProgressHorizontal";
import FindingPerKomponen from "./components/FindingPerKomponen";
import SortedKPPNScore from "./components/SortedKPPNScore";
import DasarHukum from "./components/DasarHukum";
import ScorePembinaan from "./components/ScorePembinaan";
import useAxiosJWT from "../../hooks/useAxiosJWT";
import useLoading from "../../hooks/display/useLoading";
import useSnackbar from "../../hooks/display/useSnackbar";
import useDictionary from "../../hooks/useDictionary";
import { useAuth } from "../../hooks/useAuth";
import { KPPNScoreProgressResponseType } from "./types";
import { HistoricalScoreProgressType } from "./types";
// -----------------------------------------------------------------------
interface FindingsWithChecklist{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_reponse: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  status: number,
  updated_by: string,
  title: string | null, 
  komponen_id: number,
  subkomponen_id: number,
  komponen_title: string,
  subkomponen_title: string,
  period: number
}

// -----------------------------------------------------------------------
export default function KanwilView(){
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {komponenRef, periodRef} = useDictionary();

  const {auth} = useAuth();

  const [kppnScoreProgress, setKPPNScoreProgress] = useState<KPPNScoreProgressResponseType[] | []>([]);

  const [historicalScore, setHistoricalScore] = useState<HistoricalScoreProgressType[] | []>([]);

  const [findingsData, setFindingsData] = useState<FindingsWithChecklist[]>([]);

  const isDataReady = useMemo(() => {
    return kppnScoreProgress.length > 0 && historicalScore.length > 0 && findingsData.length > 0;
  }, [kppnScoreProgress, historicalScore, findingsData]);

  const getScoreProgress = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get('/getWsJunctionScoreAndProgressAllKPPN');
      setKPPNScoreProgress(response.data.rows);
      setIsLoading(false);
    }catch(err:any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, 'error');
    }finally{
      setIsLoading(false);
    }
  };

  const getHistorical = async() => {
    try{
      setIsLoading(true);
      const response2 = await axiosJWT.get('/getWsJunctionScoreAllPeriod');
      setHistoricalScore(response2.data.rows);
      setIsLoading(false);
    }catch(err:any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, 'error');
    }finally{
      setIsLoading(false);
    }
  };

  const getFindings= async() => {
    try{
      setIsLoading(true);
      const response3 = await axiosJWT.get('/getAllFindingsWithChecklistDetail');
      setFindingsData(response3.data.rows);
      setIsLoading(false);
    }catch(err:any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, 'error');
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getScoreProgress();
    getHistorical();
    getFindings();

  }, []);

  const countProgressWorksheet = kppnScoreProgress?.reduce((a, c) => (a + (c?.scoreProgressDetail?.totalProgressKanwil || 0)), 0);
  const countTotalChecklist = kppnScoreProgress?.reduce((a, c) => (a + (c?.scoreProgressDetail?.totalChecklist || 0)), 0);
  const percentProgress = countProgressWorksheet / countTotalChecklist * 100;

  const avgScoreByKanwil = kppnScoreProgress?.reduce((a, c) => (a + getScoreKPPN(true, c.id, kppnScoreProgress)), 0) / kppnScoreProgress?.length;
  const avgScoreByKPPN = kppnScoreProgress?.reduce((a, c) => (a + getScoreKPPN(false, c.id, kppnScoreProgress)), 0) / kppnScoreProgress?.length;

  const currentPeriodIndex = periodRef?.list?.findIndex((item) => item.id === auth?.period) || 0;
  const startIndex4 = Math.max(0, currentPeriodIndex - 3); 
  const last4Period = historicalScore?.slice(startIndex4, currentPeriodIndex+1);
  const last4PeriodString = last4Period.map(item => item.name.replace("Semester", "Smt") || ""); 
  const Last4PeriodScorePerKPPN = last4Period.map(item => item.kppn.map(k => k.scoreProgressDetail.scoreByKanwil || 0)); // [[..6],[...6],...]
  const avgScoreLast4Period = Last4PeriodScorePerKPPN.map((item) => (item.reduce((a, c) => (a + c), 0) / item.length).toFixed(2)); // [9,2] , [9.5], [9.6]

  const komponenRefStringArray = komponenRef?.map((item) => item.alias) || [];

  const startIndex2 = Math.max(0, currentPeriodIndex - 2); 
  const last2Period = periodRef?.list?.slice(startIndex2, currentPeriodIndex);

  const last2PeriodFindings = last2Period?.map((item) => {
    const findingsPerKomponen = komponenRef?.map((k) => {
      return findingsData?.filter((f) => (f.komponen_id === k.id) && (f.period === item.id))?.length || 0;
    })

    return {
      name: item.name || "",
      type: 'bar',
      fill: 'gradient',
      data: findingsPerKomponen || []
    }
  }) || [];

  if(!isDataReady){
    return( 
    <>
      <Grid item xs={12} md={4}>
        <Box marginRight={2}> 
          <Skeleton variant="rounded" height={'200px'} width={'100%'} /> 
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box marginRight={2}> 
          <Skeleton variant="rounded" height={'200px'} width={'100%'} /> 
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box marginRight={2}> 
          <Skeleton variant="rounded" height={'200px'} width={'100%'} /> 
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box marginRight={2}> 
          <Skeleton variant="rounded" height={'420px'} width={'100%'} /> 
        </Box>
      </Grid>

      <Grid item xs={12} md={8}>
        <Box marginRight={2}> 
          <Skeleton variant="rounded" height={'420px'} width={'100%'} /> 
        </Box>
      </Grid>
    </>);
  };

  return(
    <>
      <Grid item xs={12} md={4}>
        <ProgressPembinaan 
          header={`Progress Kertas Kerja`}
          number={percentProgress}
          footer={`${new Date().toLocaleString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}`}
          detail={`${countProgressWorksheet}/${countTotalChecklist}`}
          icon={`mdi:cash-register`}
          color={theme.palette.primary.main}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <ProgressHorizontal
          header={`Progress Per KPPN`}
          data={
                kppnScoreProgress.map((item) =>({
                    id:Number(item.id), 
                    text:item.alias, 
                    value:(getProgressKPPN(item.id, kppnScoreProgress) || 0)
                  }))
                }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <ScorePembinaan
          header={`Nlai Kinerja KPPN (avg)`}
          selfScore={avgScoreByKPPN}
          kanwilScore={avgScoreByKanwil}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <DasarHukum 
          title={'Dasar Hukum'} 
          subheader="Peraturan Direktur Jenderal Perbendaharaan Nomor PER-1/PB/2023"
        /> 
      </Grid>

      <Grid item xs={12} md={8}>
        <ScoreHistory
          title= "Rata-Rata Nilai Kinerja KPPN"
          subheader = '4 periode terakhir'
          chartLabels={last4PeriodString}
          chartData= {[
            {
              name: 'Rata2 Nilai KPPN',
              type: 'area',
              fill: 'gradient',
              data: avgScoreLast4Period
            },
          ]}
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <FindingPerKomponen
          title= "Permasalahan Per Komponen"
          subheader = '2 periode terakhir'
          chartLabels={komponenRefStringArray}
          chartData= {last2PeriodFindings}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <SortedKPPNScore
          title= "Nilai Per KPPN"
          subheader = 'Periode Smt 1 2023'
          chartData= {historicalScore}
        />
      </Grid>
    
    </>
  )
}

// =========================================================================================================================================================

function getProgressKPPN(kppnId: string, kppnScoreProgress: KPPNScoreProgressResponseType[]){
  const countProgressKPPN =  kppnScoreProgress?.filter((item) => item.id === kppnId )?.[0]?.scoreProgressDetail?.totalProgressKanwil || 0;
  const countTotalChKPPN = kppnScoreProgress?.filter((item) => item.id === kppnId )?.[0]?.scoreProgressDetail?.totalChecklist || 0;
  return countProgressKPPN / countTotalChKPPN * 100;
};

function getScoreKPPN(isKanwil: boolean, kppnId: string, kppnScoreProgress: KPPNScoreProgressResponseType[]){
  const scoreProgressDetail =  kppnScoreProgress?.filter((item) => item.id === kppnId )?.[0]?.scoreProgressDetail;
  const score = (isKanwil?scoreProgressDetail?.scoreByKanwil: (isKanwil?scoreProgressDetail?.scoreByKanwil: scoreProgressDetail?.scoreByKPPN)) || 0;
  return score
};