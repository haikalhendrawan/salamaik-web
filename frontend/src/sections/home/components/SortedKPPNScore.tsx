import {useState} from "react";
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader, Button,  } from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Iconify from '../../../components/iconify';
// components
import { useChart } from '../../../components/chart';
import PeriodSelectionPopper from "./PeriodSelectionPopper";
import useDictionary from "../../../hooks/useDictionary";

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

interface SortedKPPNScoreProps{
  title: string,
  subheader: string,
  chartData: any[],
  colors?: string,
};

// --------------------------------------------------------------------
export default function SortedKPPNScore({ title, subheader, chartData, colors, ...other }: SortedKPPNScoreProps) {
  const theme = useTheme();
  
  const [open, setOpen] = useState<any>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

  const handleClose = () => {
    setOpen(null);
  };

  const handleChangePeriod = (newPeriod: number) => {
    setSelectedPeriod(newPeriod);
    setOpen(null);
    console.log(chartData)
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    setOpen(target);
  };

  const filteredChartData = chartData?.filter((item) => item.id === 0)[selectedPeriod]?.kppn?.map((unit: any) => ({
    label: unit.alias, 
    value: unit.scoreProgressDetail.scoreByKanwil
  })) || [];

  const {periodRef} = useDictionary();

  const chartLabels = filteredChartData.map((i: any) => i.label);

  const chartSeries = filteredChartData.map((i: any) => i.value);

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (val: number) => Number(val).toFixed(2),
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
              onClick={(e) => handleClick(e)}
              >
                {periodRef?.list.filter((p) => p.id === selectedPeriod)[0]?.name}
            </StyledButton>
          }  
          />

        <Box sx={{ mx: 3 }} dir="ltr">
          <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={335} />
        </Box>
      </Card>

      <PeriodSelectionPopper open={open} close={handleClose} value={selectedPeriod} changeValue={handleChangePeriod} />
    </>
  );
}