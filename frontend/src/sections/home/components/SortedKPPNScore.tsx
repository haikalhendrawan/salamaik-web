import {useState} from "react";
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader, Button,  } from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Iconify from '../../../components/iconify';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------
const StyledButton = styled(Button)(({theme}) => ({
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightMedium,
  borderRadius:'8px', 
  backgroundColor:theme.palette.background.neutral, 
  border:'0px',
  '&:hover': {
    outline:0,
    border:0,
  }
}));

const allValue = ['Smt 2 2022', 'Smt 1 2023', 'Smt 2 2023'];

interface SortedKPPNScoreProps{
  title: string,
  subheader: string,
  chartData: any[],
  colors?: string,
};

// --------------------------------------------------------------------
export default function SortedKPPNScore({ title, subheader, chartData, colors, ...other }: SortedKPPNScoreProps) {
  const theme = useTheme();
  
  const [open, setOpen] = useState(null);

  const handleClose = () => {
    setOpen(null);
  };

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName: string) => seriesName,
        title: {
          formatter: (val: any) => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
      labels:{
        formatter: (val: number) => val
      },
      max:10,
      tickAmount: 5,
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val
      },
      min:8.5,
    },
    colors
  });

  return (
    <>
    <Card {...other}>
      <CardHeader 
        title={title} 
        subheader={subheader} 
        action={
          <StyledButton
            aria-label="settings" 
            variant='outlined'
            endIcon={<Iconify icon="mdi:arrow-down-drop" />}
            disableFocusRipple
            >
              {allValue[0]}
          </StyledButton>
        }  
        />

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={335} />
      </Box>
    </Card>

    </>
  );
}