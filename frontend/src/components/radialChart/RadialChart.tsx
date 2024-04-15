import {useState} from "react";
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, Button} from '@mui/material';
import {styled, useTheme, alpha} from '@mui/material/styles';
import debounce from "lodash.debounce"
import Chart from '../chart';
import { useChart } from '../chart';
import Iconify from '../iconify';
// ----------------------------------------------------------------------
interface RadialChartProps {
  chart: {
    labels: string[],
    colors: string,
    series: number[],
    toColor: string
  }
};

// ----------------------------------------------------------------------
export default function RadialChart(props: RadialChartProps) {
  const { labels, colors, series, toColor} = props.chart;
  const theme = useTheme();
  const [isHover, setIsHover] = useState(false);

  const LABEL_VALUE = {
    show: true,
    offsetY: -8,
    formatter: (val: number) => `${val} %`,
    color: theme.palette.text.primary,
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    lineHeight: theme.typography.h5.lineHeight,
  };

  const LABEL_VALUE2 = {
    show: true,
    offsetY: -8,
    formatter: (val: number) => labels,
    color: theme.palette.text.primary,
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    lineHeight: theme.typography.h5.lineHeight,
  };

  
  const chartOptions: any = {
    labels:' ',
    chart: {
      id: `basic-bar${Math.random()}`,
      toolbar: { show: false },
      zoom: { enabled: false },
      // animations: { enabled: false },
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily,
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.04,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.88,
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [toColor],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    grid: {
      padding: {
        top: -20,
        right: -20,
        bottom: -20,
        left: -20,
      }
    },
    legend: {
      show: false
    },
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round',
    },
    plotOptions:{
      radialBar: {        
        track: {
        strokeWidth: '100%',
        background: alpha(theme.palette.grey[500], 0.16),
        },
        dataLabels: {
          value: LABEL_VALUE,
        },
      },
    }, 
    colors: [
      colors
    ],
  };

  const delayedSetHover = debounce((value: any) => setIsHover(value), 200);

  return (
    <>
      <Box onMouseEnter={() => delayedSetHover(true)} onMouseLeave={() => delayedSetHover(false)}>
        <Chart
          dir="ltr"
          type="radialBar"
          series={series}
          options={chartOptions}
          width="100%"
          height="100%"
          style={{display:isHover?'none':'block', pointerEvents: isHover ? 'none' : 'auto' }}
        />
        <Chart
          dir="ltr"
          type="radialBar"
          series={series}
          options={{...chartOptions, plotOptions:{radialBar:{dataLabels:{value:LABEL_VALUE2}}}}}
          width="100%"
          height="100%"
          style={{display:isHover?'block':'none', pointerEvents: isHover ? 'none' : 'auto' }}
        />
      </Box>
    </>
  );
}
