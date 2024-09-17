/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {Card, Typography, CardContent, Stack, LinearProgress, Box,} from '@mui/material';
import Scrollbar from "../../../components/scrollbar/Scrollbar";
// import LinearProgressWithLabel from "../../components/linear-progress-with-label/LinearProgressWithLabel";
// ----------------------------------------------
interface dataLabel{
  id?: number,
  text: string,
  value: number,
}

interface ProgressHorizontalProps {
  header: string,
  data: dataLabel[]
};

// ----------------------------------------------

export default function ProgressHorizontal({header, data}:ProgressHorizontalProps){

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
              {data?.map((item, index) => (
                <LinearProgressWithLabel key={index} value={item.value}  text={item.text}></LinearProgressWithLabel>
              ))}
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
  text: string
};

function LinearProgressWithLabel(props : LinearProgressWithLabelProps) {
  return (

      <>
      <Stack direction='column' spacing={0}>
        <Typography variant="body3" sx={{mb:-1, fontSize:12}}>{props.text}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', m:0 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="buffer" {...props} sx={{borderRadius:'12px'}} valueBuffer={props.value}/>
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