import {useState} from "react";
import {Card, Typography, Grid, FormControl, CardContent, Stack, LinearProgress, Box, Tooltip} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Scrollbar from "../../components/scrollbar/Scrollbar";
// import LinearProgressWithLabel from "../../components/linear-progress-with-label/LinearProgressWithLabel";
// ----------------------------------------------
interface ProgressKomponenProps {
  header: string,
  number: number,
  footer: string,
  icon: string,
  color: string
};

// ----------------------------------------------

export default function ProgressKomponen({header, number, footer, icon, color}: ProgressKomponenProps){
  const theme = useTheme();

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent>
        <Stack direction='column'>
          <Typography variant="subtitle2" sx={{mb:1}}>{header}</Typography>

          <Scrollbar  sx={{
            height: 110,
            '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
          }}>
            <Stack direction={'column'} spacing={0}>
              <LinearProgressWithLabel value={80} tooltip={'20/20 diselesaikan'} text={'Treasurer'}></LinearProgressWithLabel>
              <LinearProgressWithLabel value={27.5} tooltip={'20/20 diselesaikan'} text={'PF, RKKD, SM'}></LinearProgressWithLabel>
              <LinearProgressWithLabel value={46.5} tooltip={'20/20 diselesaikan'} text={'Financial Advisor'}></LinearProgressWithLabel>
              <LinearProgressWithLabel value={92} tooltip={'20/20 diselesaikan'} text={'Tata Kelola Internal'}></LinearProgressWithLabel>
            </Stack>
          </Scrollbar>

        </Stack>
      </CardContent>
    </Card>
  )
}

// ------------------------------------------------------------------------------------
interface LinearProgressWithLabelProps {
  value: number;
  tooltip: string;
  text: string
}

function LinearProgressWithLabel(props : LinearProgressWithLabelProps) {
  return (

      <>
      <Stack direction='column' spacing={0}>
        <Typography variant="body3" sx={{mb:-1}}>{props.text}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', m:0 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" {...props} sx={{borderRadius:'12px'}} />
          </Box>
          <Box sx={{ minWidth: 40 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {`${Math.round(props.value,)}%`}
            </Typography>
          </Box>
        </Box>
      </Stack>
      
      

      </>
  );
};