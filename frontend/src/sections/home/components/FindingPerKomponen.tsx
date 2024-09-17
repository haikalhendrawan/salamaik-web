/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

interface FindingPerKomponenProps{
  title: string,
  subheader: string,
  chartLabels: any [], 
  chartData: any[] 
};

export default function FindingPerKomponen({ title, subheader, chartLabels, chartData, ...other }:FindingPerKomponenProps) {
  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    // labels: chartLabels,
    xaxis: { 
      type: 'category',
      categories: chartLabels 
    },
    yaxis:{
      min:(min: number) => min, 
      max:(max: number) => max},
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return `${y}`;
          }
          return y;
        },
      },
    },
    stroke:{
      curve: 'smooth'
    },
    markers: {
      size: 5,
  }
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={300} />
      </Box>
    </Card>
  );
}