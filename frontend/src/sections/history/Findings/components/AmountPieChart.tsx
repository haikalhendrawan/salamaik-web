/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

 import ReactApexChart from 'react-apexcharts';
 // @mui
 import { Card, CardHeader, Box } from '@mui/material';
 // components
 import { useChart } from '../../../../components/chart';
 
 // ----------------------------------------------------------------------
 
 interface AmountPieChartProps{
   title: string,
   subheader: string,
   chartLabels: any [], 
   chartData: any[] 
 };


export default function AmountPieChart({ title, subheader, chartLabels, chartData, ...other }:AmountPieChartProps) {
  const chartOptions = useChart({
    labels: chartLabels,
    xaxis: { 
      type: 'category',
      categories: chartLabels 
    },
    yaxis:{
      min:(min: number) => min, 
      max:(max: number) => max},
    stroke:{
      curve: 'smooth'
    },
    markers: {
      size: 5,
    },
    dataLabels: { enabled: true }
   });
 
   return (
     <Card {...other}>
       <CardHeader title={title} subheader={subheader} />
 
       <Box sx={{ p: 3, pb: 1 }} dir="ltr">
         <ReactApexChart type="pie" series={chartData} options={chartOptions} height={300} />
       </Box>
     </Card>
   );
}
