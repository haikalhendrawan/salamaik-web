import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

interface ScoreHistoryProps{
  title: string,
  subheader: string,
  chartLabels: string[], 
  chartData: any[] 
};

export default function ScoreHistory({ title, subheader, chartLabels, chartData, ...other }: ScoreHistoryProps) {
  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    labels: chartLabels,
    fill: { type: chartData.map((i: any) => i.fill) },
    xaxis: { type: 'category'},
    yaxis:{
      min:(min: number) => min-0.5, 
      max:(max: number) => max+0.2>10?10:max+0.2},
      formatter: (value: number) => value.toFixed(2), // Format y-axis labels to 2 decimal places
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