import {useEffect, useRef, useState} from "react";
// @mui
import { useTheme } from '@mui/material/styles';
import { avatarGroupClasses, Grid } from '@mui/material';
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
import { useAuth } from "../../hooks/useAuth";
import { KPPNScoreProgressResponseType } from "./types";
import { HistoricalScoreProgressType } from "./types";
// -----------------------------------------------------------------------


// -----------------------------------------------------------------------
export default function KanwilView(){
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {auth} = useAuth();

  const [kppnScoreProgress, setKPPNScoreProgress] = useState<KPPNScoreProgressResponseType[] | []>([]);

  const [historicalScore, setHistoricalScore] = useState<HistoricalScoreProgressType[] | []>([]);

  const getData = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get('/getWsJunctionScoreAndProgressAllKPPN');
      const response2 = await axiosJWT.get('/getWsJunctionScoreAllPeriod');
      setKPPNScoreProgress(response.data.rows);
      setHistoricalScore(response2.data.rows);
      setIsLoading(false);
    }catch(err:any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, 'error');
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const countProgressWorksheet = kppnScoreProgress?.reduce((a, c) => (a + (c?.scoreProgressDetail?.totalProgressKanwil || 0)), 0);
  const countTotalChecklist = kppnScoreProgress?.reduce((a, c) => (a + (c?.scoreProgressDetail?.totalChecklist || 0)), 0);
  const percentProgress = countProgressWorksheet / countTotalChecklist * 100;

  const avgScoreByKanwil = kppnScoreProgress?.reduce((a, c) => (a + getScoreKPPN(true, c.id, kppnScoreProgress)), 0) / kppnScoreProgress?.length;
  const avgScoreByKPPN = kppnScoreProgress?.reduce((a, c) => (a + getScoreKPPN(false, c.id, kppnScoreProgress)), 0) / kppnScoreProgress?.length;

  const last4Period = historicalScore?.slice(-4);
  const last4PeriodString = last4Period.map(item => item.name.replace("Semester", "Smt") || ""); 
  const Last4PeriodScorePerKPPN = last4Period.map(item => item.kppn.map(k => k.scoreProgressDetail.scoreByKanwil || 0)); // [[..6],[...6],...]
  const avgScoreLast4Period = Last4PeriodScorePerKPPN.map((item) => (item.reduce((a, c) => (a + c), 0) / item.length).toFixed(2)); // [9,2] , [9.5], [9.6]

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
          selfScore={avgScoreByKanwil}
          kanwilScore={avgScoreByKPPN}
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
          title= "Temuan Per Komponen"
          subheader = '2 periode terakhir'
          chartLabels={['Treasurer', 'PF, RKKD, SM', 'Financial Advisor', 'Tata Kelola Internal']}
          chartData= {[
            {
              name: 'Smt 1 2023',
              type: 'bar',
              fill: 'gradient',
              data: [3, 1, 5, 6]
            },
            {
              name: 'Smt 2 2023',
              type: 'bar',
              fill: 'gradient',
              data: [5, 1, 3, 5]
            }
          ]}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <SortedKPPNScore
          title= "Nilai Per KPPN"
          subheader = 'Periode Smt 1 2023'
          chartData= {[
            {label: 'KPPN Padang', value: 9.77},
            {label: 'KPPN Bukittinggi', value: 9.67},
            {label: 'KPPN Solok', value: 9.55},
            {label: ['KPPN Lubuk','Sikaping'], value: 9.44},
            {label: 'KPPN Sijunjung', value: 9.42},
            {label: 'KPPN Painan', value: 9.40},
          ]}
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