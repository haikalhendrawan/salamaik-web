import {useEffect, useRef} from "react";
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, LinearProgress, Button, Box } from '@mui/material';
// sections
import WelcomeCard from "./components/WelcomeCard";
import PhotoGallery from "./components/PhotoGallery";
import ProgressPembinaan from "./components/ProgressPembinaan";
import ScoreHistory from "./components/ScoreHistory";
import ProgressHorizontal from "./components/ProgressHorizontal";
import FindingPerKomponen from "./components/FindingPerKomponen";
import SortedKPPNScore from "./components/SortedKPPNScore";
import DasarHukum from "./components/DasarHukum";
import ScorePembinaan from "./components/ScorePembinaan";
// -----------------------------------------------------------------------



export default function KanwilView(){
  const theme = useTheme();

  return(
    <>
      <Grid item xs={12} md={4}>
        <ProgressPembinaan 
          header={`Progress Kertas Kerja`}
          number={40.3}
          footer={`s.d. 20 Mei 2024`}
          icon={`mdi:cash-register`}
          color={theme.palette.primary.main}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <ProgressHorizontal
          header={`Progress Per KPPN`}
          data={[
            {id:1, text:'KPPN Padang', value:90.5},
            {id:2, text:'KPPN Bukittinggi', value:86.5},
            {id:3, text:'KPPN Solok', value:88.5},
            {id:4, text:'KPPN Lubuk Sikaping', value:91.7},
            {id:5, text:'KPPN Sijunjung', value:92.8},
            {id:6, text:'KPPN Painan', value:95.5},
          ]}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <ScorePembinaan
          header={`Nlai Kinerja KPPN (avg)`}
          selfScore={9.77}
          kanwilScore={9.45}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <DasarHukum title={'Dasar Hukum'} subheader="Peraturan Direktur Jenderal Perbendaharaan Nomor PER-1/PB/2023"/> 
      </Grid>

      <Grid item xs={12} md={8}>
        <ScoreHistory
          title= "Rata-Rata Nilai Kinerja KPPN"
          subheader = '4 periode terakhir'
          chartLabels={['Smt 1 2022', 'Smt 2 2022', 'Smt 1 2023', 'Smt 2 2023']}
          chartData= {[
            {
              name: 'Rata2 Nilai KPPN',
              type: 'area',
              fill: 'gradient',
              data: [9.44, 9.56, 9.40, 9.46]
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